import { Config } from './index'

const development = (): Config => {
  return {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '',
    mongoDBString: process.env.MONGODB_CONNECTION_STRING || '',
    exchange: process.env.EXCHANGE || '',
    reportRoutingKey: process.env.REPORT_ROUTING_KEY || '',
    messageBrokerUrl: process.env.MESSAGE_BROKER_URL || '',
    reportQueue: process.env.REPORT_QUEUE || '',
  }
}

export default development
