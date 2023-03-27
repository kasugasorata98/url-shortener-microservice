import amqplib from 'amqplib'
import EventService from './event.service'

class EventController {
  private messageBrokerUrl: string
  private connection!: amqplib.Connection
  private eventService: EventService
  constructor(messageBrokerUrl: string) {
    this.eventService = new EventService()
    this.messageBrokerUrl = messageBrokerUrl
  }

  async setConnection() {
    this.connection = await amqplib.connect(this.messageBrokerUrl)
  }

  async createChannel(): Promise<amqplib.Channel> {
    if (!this.connection) await this.setConnection()
    return this.connection.createChannel()
  }

  async publishMessage(
    channel: amqplib.Channel,
    exchange: string,
    routingKey: string,
    payload: any
  ): Promise<boolean> {
    await channel.assertExchange(exchange, 'direct', {
      durable: true,
    })
    return this.eventService.publishMessage(
      channel,
      exchange,
      routingKey,
      payload
    )
  }
}
export default EventController
