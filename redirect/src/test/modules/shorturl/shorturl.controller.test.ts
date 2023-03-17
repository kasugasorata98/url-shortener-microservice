import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import ShortURLController from '../../../modules/redirect/shorturl.controller'
import logger from '../../../logger'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

let shortURLController: ShortURLController = new ShortURLController(
  'http://example.com'
)

describe('ShortURLController', () => {
  it('should generate a short id', async () => {
    jest.spyOn(shortURLController, 'generateUniqueShortId')
    const logs = logger.createLogObject()
    const shortId = await shortURLController.generateUniqueShortId(logs)
    expect(shortId?.length).toEqual(5)
    expect(shortURLController.generateUniqueShortId).toBeCalledTimes(1)
  })
})
