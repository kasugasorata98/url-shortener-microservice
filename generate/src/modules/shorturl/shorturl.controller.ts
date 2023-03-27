import { Constants } from '../../constants'
import ShortURLService from './shorturl.service'
import { Logs } from '../../entities/logs.entity'
import { config } from '../../configs'

class ShortURLController {
  private shortUrlService: ShortURLService
  private targetUrl: string
  private isTest: boolean
  constructor(targetUrl: string, isTest: boolean = false) {
    this.shortUrlService = new ShortURLService()
    this.isTest = isTest
    this.targetUrl = targetUrl
  }
  async generateUniqueShortId(
    logs: Logs,
    length: number = Constants.MIN_SHORTID_LENGTH
  ): Promise<{
    shortId: string
    targetUrl: string
    titleTag: string | null
  }> {
    try {
      const shortId = this.shortUrlService.generateShortId(
        length,
        this.targetUrl
      )
      logs.traces.push(`ShortID: ${shortId}`)
      const titleTag = await this.getTitle()
      logs.traces.push(`Title Tag: ${titleTag}`)
      const shortUrlResponse = await this.shortUrlService.addToDb(
        shortId,
        this.targetUrl
      )
      if (!this.isTest) {
        await this.shortUrlService.publishMessage(config.redirectRoutingKey, {
          event: Constants.EVENTS.ADD_TO_REDIRECT,
          data: {
            _id: shortUrlResponse._id,
            shortId: shortUrlResponse.shortId,
            targetUrl: shortUrlResponse.targetUrl,
          },
        })
        await this.shortUrlService.publishMessage(config.reportRoutingKey, {
          event: Constants.EVENTS.CREATE_REPORT,
          data: {
            _id: shortUrlResponse._id,
            shortId: shortUrlResponse.shortId,
            targetUrl: shortUrlResponse.targetUrl,
          },
        })
      }
      logs.traces.push({
        shortUrlResponse,
      })
      return {
        shortId: shortUrlResponse.shortId,
        targetUrl: shortUrlResponse.targetUrl,
        titleTag: titleTag,
      }
    } catch (err: any) {
      if (err.code === Constants.MONGOOSE_ERROR_CODES.DUPLICATED) {
        const nextLength =
          length === Constants.MAX_SHORTID_LENGTH ? length : ++length
        logs.traces.push(
          `Short ID is not unique, regenerating another short ID with ${nextLength} characters`
        )
        return this.generateUniqueShortId(logs, nextLength)
      } else throw err
    }
  }

  async getTitle(): Promise<string | null> {
    try {
      return this.shortUrlService.getTitle(this.targetUrl)
    } catch (err) {
      return null
    }
  }
}

export default ShortURLController
