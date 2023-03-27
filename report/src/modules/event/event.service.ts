import { Utils } from '../../utils'
import amqplib from 'amqplib'
import reportModel from '../../database/model/report.model'
import geoip from 'geoip-lite'
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

  addToReport(shortId: string, ipAddress: string, visitedAt: Date) {
    const geo = geoip.lookup(ipAddress === '::1' ? '113.211.93.226' : '')
    return reportModel.updateOne(
      {
        'urlMappings.shortId': shortId,
      },
      {
        $push: {
          reportDetails: {
            visitedAt,
            region: geo?.region,
            country: geo?.country,
            city: geo?.city,
            longitude: geo?.ll[1],
            latitude: geo?.ll[0],
            timezone: geo?.timezone,
            ipAddress,
          },
        },
      }
    )
  }

  createReport(_id: string, shortId: string, targetUrl: string) {
    return reportModel.create({
      urlMappings: {
        _id,
        shortId,
        targetUrl,
      },
    })
  }
}
export default EventService
