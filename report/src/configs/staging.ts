import { Config } from './index'

const staging = (): Config => {
  return {
    environment: process.env.NODE_ENV || 'staging',
    mongoDBString: process.env.MONGODB_CONNECTION_STRING || '',
    port: process.env.PORT || '',
    exchange: process.env.EXCHANGE || '',
    reportRoutingKey: process.env.REPORT_ROUTING_KEY || '',
    messageBrokerUrl: process.env.MESSAGE_BROKER_URL || '',
    reportQueue: process.env.REPORT_QUEUE || '',
  }
}

export default staging
