'use strict'

/**
 * Encrypt key/value pairs that will be sent in a request.
 *
 * @param {*} obj - any object that is being sent in a request.
 */
export const encryptReqData = obj => {
  const newObj = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[encodeURIComponent(key)] = encodeURIComponent(obj[key])
    }
  }
  return newObj
}
