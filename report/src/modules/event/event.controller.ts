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
    routingKey: string,
    callback: (message: any) => void
  ): Promise<void> {
    await channel.assertQueue(queue, {
      durable: true,
    })
    await channel.bindQueue(queue, exchange, routingKey)
    await channel.prefetch(1) // if we scale up, we dont want other receivers to receive the same thing
    this.eventService.subscribeMessage(channel, queue, callback)
  }

  async handleIncomingMessages(
    exchange: string,
    queue: string,
    routingKey: string
  ) {
    const logs = logger.createLogObject()
    logs.functionName = this.handleIncomingMessages.name
    logs.traces.push('Handling Incoming Message')
    logs.traces.push({ exchange, queue, routingKey })
    const consumeChannel = await this.createChannel()
    this.subscribeMessage(
      consumeChannel,
      exchange,
      queue,
      routingKey,
      message => {
        logs.traces.push(message)
        this.handleEvents(message, logs)
        console.log(message)
      }
    )
  }

  async handleEvents(payload: { event: string; data: any }, logs: Logs) {
    switch (payload.event) {
      case Constants.EVENTS.CREATE_REPORT: {
        logs.traces.push('Creating report')
        await this.eventService.createReport(
          payload.data._id,
          payload.data.shortId,
          payload.data.targetUrl
        )
        logs.traces.push('Successful')
        break
      }
      case Constants.EVENTS.ADD_TO_REPORT: {
        logs.traces.push('Adding into report')
        await this.eventService.addToReport(
          payload.data.shortId,
          payload.data.ipAddress,
          payload.data.visitedAt
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
