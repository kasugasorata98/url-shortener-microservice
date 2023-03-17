import { load } from 'cheerio'
import crypto from 'crypto'
import { config } from '../../configs'
import url_mappingModel from '../../database/model/url_mapping.model'
import AxiosClient from '../../lib/AxiosClient'
import EventController from '../event/event.controller'

class ShortURLService {
  private eventController: EventController
  constructor() {
    this.eventController = new EventController(config.messageBrokerUrl)
  }
  generateShortId(length: number, targetUrl: string) {
    const hash = crypto
      .createHash('sha256')
      .update(targetUrl + Date.now().toString())
      .digest('base64')
    let shortUrl = hash.substring(0, length)
    return shortUrl
  }
  addToDb(shortId: string, targetUrl: string) {
    return url_mappingModel.create({
      shortId,
      targetUrl,
    })
  }

  async getTitle(targetUrl: string): Promise<string | null> {
    const response = await AxiosClient.get(targetUrl)
    const $ = load(response.data)
    const title = $('title').text()
    return title
  }

  async publishMessage(payload: {
    event: string
    data: {
      _id: string
      shortId: string
      targetUrl: string
    }
  }) {
    const publishChannel = await this.eventController.createChannel()
    this.eventController.publishMessage(
      publishChannel,
      config.exchange,
      config.redirectRoutingKey,
      payload
    )
  }
}

export default ShortURLService
