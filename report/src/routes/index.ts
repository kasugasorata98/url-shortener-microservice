import express from 'express'
const router = express.Router()
import RedirectRoute from './redirect'

router.use('/', RedirectRoute)
export default router
