import RedirectService from './redirect.service'

class RedirectController {
  private shortId: string
  redirectService: RedirectService
  constructor(shortId: string) {
    this.redirectService = new RedirectService()
    this.shortId = shortId
  }

  async getTargetURL() {
    const targetUrl = (await this.redirectService.getTargetURL(this.shortId))
      ?.urlMappings.targetUrl
    return targetUrl
  }
}

export default RedirectController
