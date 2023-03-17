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

  async subscribeMessage(
    channel: amqplib.Channel,
    exchange: string,
    queue: string,
    routingKey: string,
    callback: (message: any) => void
  ): Promise<void> {
    await channel.assertExchange(exchange, 'direct', { durable: true })
    await channel.assertQueue(queue, {
      durable: true,
    })
    await channel.bindQueue(queue, exchange, routingKey)
    await channel.prefetch(1) // if we scale up, we dont want other receivers to receive the same thing
    this.eventService.subscribeMessage(channel, queue, callback)
  }
}
export default EventController
