import amqplib from 'amqplib'
import { Constants } from '../../constants'
import { Logs } from '../../entities/logs.entity'
import logger from '../../logger'
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
    bindingKey: string,
    callback: (message: any) => void
  ): Promise<void> {
    await channel.assertExchange(exchange, 'direct', { durable: true })

    await channel.assertQueue(queue, {
      durable: true,
    })
    await channel.bindQueue(queue, exchange, bindingKey)
    await channel.prefetch(1) // if we scale up, we dont want other receivers to receive the same thing
    console.log({ bindingKey, queue, exchange })
    this.eventService.subscribeMessage(channel, queue, callback)
  }

  async handleIncomingMessages(
    exchange: string,
    queue: string,
    bindingKey: string
  ) {
    const logs = logger.createLogObject()
    logs.functionName = this.handleIncomingMessages.name
    logs.traces.push('Handling Incoming Message')
    logs.traces.push({ exchange, queue })
    const consumeChannel = await this.createChannel()
    this.subscribeMessage(
      consumeChannel,
      exchange,
      queue,
      bindingKey,
      message => {
        logs.traces.push(message)
        this.handleEvents(message, logs)
      }
    )
  }

  async handleEvents(payload: { event: string; data: any }, logs: Logs) {
    switch (payload.event) {
      case Constants.EVENTS.ADD_TO_REDIRECT: {
        logs.traces.push('Adding into Redirect Mapping')
        this.eventService.addToRedirectMapping(
          payload.data._id,
          payload.data.shortId,
          payload.data.targetUrl
        )
        logs.traces.push('Successful')
        break
      }
      default: {
        logs.traces.push('EVENT does not exist')
      }
    }
    logger.log(logs)
  }
}
export default EventController
