import { Utils } from '../../utils'
import amqplib from 'amqplib'
import redirect_mappingModel from '../../database/model/redirect_mapping.model'
class EventService {
  publishMessage(
    channel: amqplib.Channel,
    exchange: string,
    routingKey: string,
    payload: any
  ): boolean {
    if (Utils.isObject(payload)) {
      payload = JSON.stringify(payload)
      return channel.publish(exchange, routingKey, Buffer.from(payload), {
        contentType: 'application/json',
      })
    } else {
      return channel.publish(exchange, routingKey, Buffer.from(payload), {
        contentType: 'text/plain',
      })
    }
  }

  async subscribeMessage(
    channel: amqplib.Channel,
    queue: string,
    callback: (message: any) => void
  ): Promise<void> {
    channel.consume(queue, msg => {
      if (msg) {
        const contentType = msg.properties.contentType
        let message: any

        if (contentType === 'application/json') {
          message = JSON.parse(msg.content.toString())
        } else {
          message = msg.content.toString()
        }
        //console.log(`Received message: ${JSON.stringify(message)}`)
        channel.ack(msg)
        callback(message)
      }
    })
  }

  addToRedirectMapping(_id: string, shortId: string, targetUrl: string) {
    return redirect_mappingModel.create({
      urlMappings: {
        _id,
        shortId,
        targetUrl,
      },
    })
  }
}
export default EventService
