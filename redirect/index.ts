import express from 'express'
import cors from 'cors'
import MongooseClient from './src/database/MongooseClient'
import routes from './src/routes/index'
import { config } from './src/configs'
import logger from './src/logger'
import EventController from './src/modules/event/event.controller'

async function main() {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(
    express.urlencoded({
      extended: true,
    })
  )

  app.use('/', routes)

  const eventController = new EventController(config.messageBrokerUrl)
  eventController.handleIncomingMessages(
    config.exchange,
    config.redirectQueue,
    config.redirectRoutingKey
  )

  MongooseClient.connect(config.mongoDBString)
    .then(async (res: any) => {
      logger.log('MongoDB connected to ' + res.connections[0].name)
      app.listen(config.port, () => {
        logger.log('Listing listening at port: ' + config.port)
      })
    })
    .catch((err: any) => {
      logger.error(err)
    })
}
main()
