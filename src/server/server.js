// ! split into web server and app server
// TODO: worker threads for app server
// TODO: replace gql api with restful

import bodyParser from "body-parser";
import chalk from "chalk";
import compression from "compression";
import SessionStore from "connect-pg-simple";
import express from "express";
import session from "express-session";
import fs from "fs";
import http from "http";
import https from "https";
import morgan from "morgan";
import passport from "passport";
import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import config from "../../webpack.dev.config";
import { User } from "./db";
import { prettyLogger } from "./utils";

/**
 * Contains the logic for running the server in both development and production.
 * Instantiated in `server/index`.
 */
export default class Server {
  static configurations = {
    // Note: You may need sudo to run on port 443
    development: { ssl: false, port: 3000, hostname: "localhost" },
    production: { ssl: true, port: 443, hostname: "example.com" }
  };

  /**
   *
   */
  NODE_ENV = process.env.NODE_ENV || "production";

  /**
   *
   */
  SECRET =
    process.env.SESSION_SECRET ||
    "Peeps. Stand up to hard ware and step into style.";

  /**
   * If `enabled`, Hot Module Replacement is active. Enable *FOR DEVELOPMENT ONLY*
   */
  HMR = process.env.HMR === "enabled" ? "enabled" : "disabled";

  constructor() {
    this.app = express();
    this.config = this.configurations[this.NODE_ENV];

    // Create the HTTPS or HTTP server, per configuration
    this.server = this.config.ssl
      ? // Assumes certificates are in .ssl folder from package root.
        // Make sure the files are secured.
        https.createServer(
          {
            cert: fs.readFileSync(
              path.resolve(__dirname, "ssl", this.NODE_ENV, "server.crt")
            ),
            key: fs.readFileSync(
              path.resolve(__dirname, "ssl", this.NODE_ENV, "server.key")
            )
          },
          this.app
        )
      : http.createServer(this.app);
  }

  /**
   * Creates an app for development, applies `webpack-dev-middleware`
   * and `webpack-hot-middleware` to enable Hot Module Replacement if `process.env.HMR` is `enabled`.
   */
  createAppDev() {
    this.syncDb()
      .then(dbConnection => this.applyMiddleware(dbConnection))
      .then(() => this.startListening())
      .then(() => this.HMR === "enabled" && this.webpackDevMiddleware())
      .then(() => this.staticallyServeFiles())
      .catch(err => console.log(err));
  }

  /**
   * Creates an optimized production instance of the express server.
   */
  createAppProd() {
    this.syncDb()
      .then(dbConnection => this.applyMiddleware(dbConnection))
      .then(() => this.staticallyServeFiles())
      .catch(err => console.log(err));
  }

  /**
   * Syncs the database to begin the creation of the server.
   */
  async syncDb() {
    // ! use sequelize equivalent
    const dbConnection = getConnection();
    if (dbConnection.isConnected === false) {
      await dbConnection.connect().catch(err => console.log(err));
    }
    return dbConnection;
  }

  /**
   * Creates the body of the server. Logging middleware (`morgan`),
   * body parsing middleware (`bodyParser`),
   * compression middleware (`compression`), as well as
   * session, passport, auth and the api are applied here.
   */
  applyMiddleware(dbConnection) {
    this.app.use((req, res, next) => {
      res.set({
        "Access-Control-Allow-Credentials": "same-origin",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "DELETE,GET,PATCH,POST,PUT",
        "Access-Control-Allow-Origin": this.config.hostname
      });

      next();
    });

    // logging middleware
    this.app.use(morgan("dev"));

    // body parsing middleware
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // compression middleware
    this.app.use(compression());

    this.sessionAndPassport(dbConnection);
    this.api(dbConnection);
  }

  /**
   * Creates an express session and initialized passport with the session.
   */
  sessionAndPassport(dbConnection) {
    // session middleware with passport
    this.app.use(
      session({
        cookie: {
          httpOnly: this.config.ssl,
          maxAge: 4 * 60 * 60 * 1000,
          path: "/", // ! ???
          secure: this.config.ssl
        },
        proxy: this.config.ssl,
        resave: false, // ! ???
        rolling: true, // ! ???
        saveUninitialized: false,
        secret: this.SECRET,
        store: new (SessionStore(session))({
          conObject: {
            database: "uber_starter",
            host: this.config.host,
            password: "password",
            port: 5432,
            user: "kyleuehlein" // ! ------
          }
        })
      })
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // passport registration
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await dbConnection.getRepository(User).findOne({ id });
        done(null, user);
      } catch (err) {
        done(err);
      }
    });
  }

  /**
   * Route to api.
   */
  api(dbConnection) {
    // * passes dbConnection to ApolloServer to add to context
    // apollo(dbConnection).applyMiddleware({
    //   app: this.app,
    //   cors: {
    //     allowedHeaders: ["Authorization", "Content-Type"],
    //     credentials: true,
    //     methods: ["DELETE", "GET", "PATCH", "POST", "PUT"],
    //     origin: this.config.hostname
    //   }
    // })

    // handle requests that miss end points above
    this.errorHandlingEndware();
  }

  /**
   * Handles any unhandled errors that have been passed down.
   */
  errorHandlingEndware() {
    this.app.use((err, req, res, next) => {
      console.error(err);
      console.error(err.stack);
      res
        .status(err.status || 500)
        .send(err.message || "Internal server error.");
    });
  }

  /**
   * Starts listening to the server on `3000`.
   * *DEVELOPMENT ONLY*
   */
  startListening() {
    this.server.listen(this.config.port, () =>
      prettyLogger(
        "log",
        "Listening on 👂",
        `  - ${chalk.greenBright(
          `http${this.config.ssl ? "s" : ""}://${this.config.hostname}:${
            this.config.port
          }`
        )}`
      )
    );
  }

  /**
   * Applies `webpack-dev-middleware` and `webpack-hot-middleware`
   * to enable Hot Module Replacement in development.
   * *NOTE* --- Do not use nodemon or anything that restarts server...
   * *DEVELOPMENT ONLY*
   */
  webpackDevMiddleware() {
    const compiler = webpack(config);
    this.app.use(
      webpackDevMiddleware(compiler, {
        logLevel: "warn",
        publicPath: config.output.publicPath,
        stats: {
          colors: true
        }
      })
    );

    this.app.use(
      webpackHotMiddleware(compiler, {
        heartbeat: 2000,
        log: console.log,
        path: "",
        reload: false // ! true --- issues with react-router caused force reload
      })
    );
  }

  /**
   * Serves the static bundle generated by webpack,
   * as well as the other static assets like css and html files.
   */
  staticallyServeFiles() {
    // path to root
    const rootDir = ["..", ".."];

    // staticly serve styles
    this.app.use(
      express.static(
        path.join(__dirname, ...rootDir, "src", "client", "main.css")
      )
    );

    // static file-serving middleware then send 404 for the rest (.js, .css, etc.)
    this.app
      .use(express.static(path.join(__dirname, ...rootDir)))
      .use((req, res, next) =>
        path.extname(req.path).length
          ? next(new Error("404 - Not found"))
          : next()
      );

    // sends index.html
    this.app.use("*", (req, res) => {
      if (this.HMR === "enabled") {
        res.set({
          Connection: "keep-alive",
          "Content-Type": "text/event-stream"
        });
      }

      // res.sendFile(path.join(__dirname, ...rootDir, 'public', 'index.html'))
    });
  }
}
