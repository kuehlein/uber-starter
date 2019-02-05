'use strict'

import { Router } from 'express'

const router = Router()

router.use('/auth', require('./auth'))
router.use('/users', require('./users'))

// endware?
router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

export default router
