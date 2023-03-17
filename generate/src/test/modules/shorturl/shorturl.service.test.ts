import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import ShortURLService from '../../../modules/shorturl/shorturl.service'
import url_mappingModel from '../../../database/model/url_mapping.model'
import { Utils } from '../../../utils'

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

describe('ShortURLService', () => {
  let service: ShortURLService
  beforeEach(() => {
    service = new ShortURLService()
  })
  describe('generateShortId', () => {
    it('returns a string of the correct length', () => {
      const length = 6
      const targetUrl = 'https://www.example.com'
      const shortId = service.generateShortId(length, targetUrl)
      expect(shortId).toHaveLength(length)
      expect(typeof shortId).toBe('string')
    })
    it('returns a valid base64-encoded string', () => {
      const length = 8
      const targetUrl = 'https://www.example.com'
      const shortId = service.generateShortId(length, targetUrl)
      expect(() => Buffer.from(shortId, 'base64')).not.toThrow()
    })
    it('generates different IDs for different target URLs', async () => {
      const length = 10
      const targetUrl1 = 'https://www.example.com'
      const targetUrl2 = 'https://www.2example.org'
      const shortId1 = service.generateShortId(length, targetUrl1)
      const shortId2 = service.generateShortId(length, targetUrl2)
      expect(shortId1).not.toEqual(shortId2)
    })
    it('generates different IDs for the same target URL with different timestamps', async () => {
      const length = 12
      const targetUrl = 'https://www.example.com'
      const shortId1 = service.generateShortId(length, targetUrl)
      await Utils.sleep(500)
      const shortId2 = service.generateShortId(length, targetUrl)
      expect(shortId1).not.toEqual(shortId2)
    })
  })

  describe('addToDb', () => {
    it('should add a new document to the database', async () => {
      const shortId = 'abc123456778'
      const targetUrl = 'https://example.com'
      await service.addToDb(shortId, targetUrl)

      const document = await url_mappingModel.findOne({ shortId })

      expect(document).toBeDefined()
      expect(document?.targetUrl).toBe(targetUrl)
    })
  })
})
