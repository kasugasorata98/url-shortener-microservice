import { config } from '../../configs'
import redirect_mappingModel from '../../database/model/redirect_mapping.model'
import EventController from '../event/event.controller'

class RedirectService {
  private eventController: EventController
  constructor() {
    this.eventController = new EventController(config.messageBrokerUrl)
  }
  getTargetURL(shortId: string) {
    return redirect_mappingModel.findOne({
      'urlMappings.shortId': shortId,
    })
  }
  async publishMessage(
    routingKey: string,
    payload: {
      event: string
      data: {
        shortId: string
        ipAddress: string
        visitedAt: Date
      }
    }
  ) {
    const publishChannel = await this.eventController.createChannel()
    this.eventController.publishMessage(
      publishChannel,
      config.exchange,
      routingKey,
      payload
    )
  }
}

export default RedirectService
