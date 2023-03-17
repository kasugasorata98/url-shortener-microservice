import express from 'express'
const router = express.Router()
import V1Routes from './v1'

router.use('/v1', V1Routes)
export default router
