import express, { Request, Response } from 'express'
import { Constants } from '../../constants'
import logger from '../../logger'
import RedirectController from '../../modules/redirect/redirect.controller'

const router = express.Router()

router.get('/:shortId', async (req: Request, res: Response) => {
  const logs = logger.createLogObject()
  try {
    const { shortId } = req.params
    const redirectController = new RedirectController(shortId)
    const targetUrl = await redirectController.getTargetURL()
    logs.traces.push({ targetUrl })
    if (!targetUrl)
      return res.status(Constants.HTTP_CODE.NOT_FOUND).json({
        message: Constants.ERROR_MESSAGE.SHORT_ID_NOT_FOUND,
      })
    logger.log(logs)
    res.status(Constants.HTTP_CODE.MOVED_PERMANENTLY).redirect(targetUrl)
  } catch (err: any) {
    logs.response = {
      message: err?.message,
      code: err?.code,
    }
    logger.error(logs)
    res.status(Constants.HTTP_CODE.INTERNAL_SERVER_ERROR).json(logs.response)
  }
})

export default router
