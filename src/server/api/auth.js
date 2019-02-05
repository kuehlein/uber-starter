'use strict'

import { Router } from 'express'
import passport from 'passport'
import { Strategy } from 'passport-local'

import { User } from '../db'

const router = Router()

/**
 * *Put this somewhere else*
 *
 * Apply `passport`'s local strategy. Checks for valid input and handles any
 * errors before the login info is passed to `req.login`.
 */
passport.use(
  // ! still might not check for `req.body.email` and fail - might have to use `req.body.username`
  new Strategy({ usernameField: 'email', passReqToCallback: true },
    async (email, password, done) =>
      await User.findOne({ email: email.toLowerCase() }) // ! does this work for sequelize?
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'Incorrect email.' })
          }
          if (!user.isValidPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' })
          }
          return done(null, user)
        })
        .catch(err => done(err))
  )
)

/**
 * Logs in an existing user. `passport.authenticate` is called which triggers
 * the local strategy. The local strategy will then either handle any errors,
 * or pass the login information to `req.login`.
 */
router.post('/login', async (req, res, next) => {
  // ! req.body.email may be invalid --- try req.body.username if so
  // add the user's login info to `req.body` so that the local stratey can access it
  req.body.email = user.email
  req.body.password = password || user.password

  passport.authenticate(
    "local",
    (err, authenticatedUser) => {
      if (err) reject(err)

      req.login(authenticatedUser, err => {
        if (err) reject(err)
        resolve(authenticatedUser)
      })
    }
  )(req)



  // try {
  //   const user = await User.findOne({ where: { email: req.body.email } })
  //   if (!user) {
  //     console.log('No such user found:', req.body.email)
  //     res.status(401).send('Wrong username and/or password')
  //   } else if (!user.isValidPassword(req.body.password)) {
  //     console.log('Incorrect password for user:', req.body.email)
  //     res.status(401).send('Wrong username and/or password')
  //   } else {
  //     req.login(user, err => (err ? next(err) : res.json(user))) // ! res.redirect('/login') ???
  //   }
  // } catch (err) {
  //   next(err)
  // }
})

/**
 * Creates a new user account and logs them in using `req.login`. If the
 * provided email is already in use or no email or password is provided,
 * an error will be thrown.
 */
router.post('/signup', async (req, res, next) => {

  // if (!user.email || !user.username || !user.password) {
  //   throw new Error('You must provide an email, username and password.')
  // }

  // const createdUser = new User()
  // createdUser.email = user.email
  // createdUser.password = user.password
  // createdUser.username = user.username

  // // ! figure out proper syntax for sequelize

  // return (
  //   createdUser
  //     .save()
  //     // * use original user arg
  //     .then(newUser => login(req, newUser, user.password))
  //     .catch(err => err.message)
  // )


  try {
    const user = await User.create(req.body)
    req.login(user, err => (err ? next(err) : res.json(user)))
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

/**
 * Logs-out the currently logged in user and destroys the session.
 */
router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/') // ! unfamilliar with this (gql)
})

/**
 * Retrieves the authenticated user's info. `req.user` was placed on the Request
 * object by `passport`
 */
router.get('/me', (req, res) => res.json(req.user))

export default router
