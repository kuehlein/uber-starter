import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsUrl
} from "class-validator"
import crypto from 'crypto'
import Sequelize from 'sequelize'

import db from '../_db'

const defaultAvatar = path.resolve("public", "assets", "default-avatar.jpg")

/**
 * User model. Contains fields for name, email, password and other user related information,
 * as well as methods for password encryption and verification.
 */
const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get: () => this.getDataValue('password'),
  },
  salt: {
    type: Sequelize.STRING,
    allowNull: false,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get: () => this.getDataValue('salt')
  }
})

/**
 * -----------------------------------------------------------------------------
 * * ---------------------------- Instance Methods ----------------------------
 * -----------------------------------------------------------------------------
 */

/**
 * *Instance Method*
 *
 * Compares a candidate password with a user's hashed password in constant time
 * (to prevent timing attacks).
 *
 * @param {string} candidatePwd - a password attempt to check against the actual
 * @returns {boolean}
 */
User.prototype.isValidPassword = candidatePwd => {
  const encryptedCandidate = User.encryptPassword(
    candidatePwd,
    this.salt
  )

  if (this.password.length !== encryptedCandidate.length) return false

  let result = 0

  for (let i = encryptedCandidate.length - 1; i >= 0; i--) {
    result |= encryptedCandidate.charCodeAt(i) ^ this.password.charCodeAt(i)
  }

  return result === 0
}

/**
 * -----------------------------------------------------------------------------
 * * ------------------------------ Class Methods ------------------------------
 * -----------------------------------------------------------------------------
 */

/**
 * *Class Method*
 *
 * Generates a salt with which to encrypt the user's password in `encryptPassword`.
 *
 * @returns {string}
 */
User.generateSalt = () => crypto.randomBytes(16).toString('base64')

/**
 * *Class Method*
 *
 * Encrypts the user's password using the salt generated in `generateSalt`.
 *
 * @param {string} plainText - password as plain text
 * @param {string} salt      - salt to encrypt password
 * @returns {string}
 */
User.encryptPassword = (plainText, salt) =>
  crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')

/**
 * -----------------------------------------------------------------------------
 * * ----------------------------- Lifecycle Hooks -----------------------------
 * -----------------------------------------------------------------------------
 */

/**
 * *Lifecycle Hook*
 *
 * Listens for when a user's password changes. The user's `password`
 * and `salt` are then updated.
 *
 * @param {*} user - `{ password: string, salt: string }`
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)

export default User
