import { config } from '../../configs'
import { Constants } from '../../constants'
import RedirectService from './redirect.service'

class RedirectController {
  private shortId: string
  private ipAddress: string | undefined
  redirectService: RedirectService
  private isTest: boolean
  constructor(
    shortId: string,
    ipAddress: string | undefined,
    isTest: boolean = false
  ) {
    this.redirectService = new RedirectService()
    this.shortId = shortId
    this.isTest = isTest
    this.ipAddress = ipAddress
  }

  async getTargetURL() {
    const targetUrl = (await this.redirectService.getTargetURL(this.shortId))
      ?.urlMappings.targetUrl
    if (!this.isTest) {
      await this.redirectService.publishMessage(config.reportRoutingKey, {
        event: Constants.EVENTS.ADD_TO_REPORT,
        data: {
          shortId: this.shortId,
          ipAddress: this.ipAddress || '',
          visitedAt: new Date(),
        },
      })
    }
    return targetUrl
  }
}

export default RedirectController
