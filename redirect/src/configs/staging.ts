import { Config } from './index'

const staging = (): Config => {
  return {
    environment: process.env.NODE_ENV || 'staging',
    mongoDBString: process.env.MONGODB_CONNECTION_STRING || '',
    port: process.env.PORT || '',
    exchange: process.env.EXCHANGE || '',
    messageBrokerUrl: process.env.MESSAGE_BROKER_URL || '',
    redirectQueue: process.env.REDIRECT_QUEUE || '',
    redirectRoutingKey: process.env.REDIRECT_ROUTING_KEY || '',
    reportRoutingKey: process.env.REPORT_ROUTING_KEY || '',
  }
}

export default staging
