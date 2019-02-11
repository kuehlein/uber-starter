import Server from "./server";

const server = new Server();

// ! do I even need this now?
if (process.env.NODE_ENV !== "production") {
  /* eslint-disable-next-line global-require */
  import("../../secrets");
}

/**
 * This evaluates to true when executed from the command line and
 * creates an instance of the server for either development or production
 */
// if (require.main === module) {
server.createAppDev();
// } else {
//   server.createAppProd();
// }

export default server;
