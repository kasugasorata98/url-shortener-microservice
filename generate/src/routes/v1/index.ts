import express from 'express'
const router = express.Router()
import shortUrlRoute from './short-url'

router.use('/short-url', shortUrlRoute)
export default router
