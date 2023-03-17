import express, { Request, Response } from 'express'
import { Constants } from '../../../constants'
import logger from '../../../logger'
import ShortURLController from '../../../modules/shorturl/shorturl.controller'

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
  const logs = logger.createLogObject()
  try {
    logs.endpoint = '/v1/short-url'
    logs.method = 'post'
    logs.request = req.body
    const { targetUrl } = req.body
    if (!targetUrl) {
      logs.response = Constants.ERROR_MESSAGE.TARGET_URL_MISSING
      return res.status(400).json({
        message: logs.response,
      })
    }
    const shortURLController = new ShortURLController(targetUrl)
    const response = await shortURLController.generateUniqueShortId(logs)
    logs.response = response
    logger.log(logs)
    res.status(Constants.HTTP_CODE.CREATED).json({
      shortId: response.shortId,
      titleTag: response.titleTag,
      targetUrl: response.targetUrl,
    })
  } catch (err: any) {
    logs.response = {
      message: err?.message,
      code: err?.code,
    }
    logger.error(logs)
    res.status(500).json(logs.response)
  }
})

export default router
