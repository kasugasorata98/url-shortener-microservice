import express, { Response } from 'express'
import cors from 'cors'
import MongooseClient from './src/database/MongooseClient'
import routes from './src/routes/index'
import { config } from './src/configs'
import logger from './src/logger'

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
