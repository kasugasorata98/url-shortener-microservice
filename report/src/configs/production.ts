import { Config } from './index'

const production = (): Config => {
  return {
    environment: process.env.NODE_ENV || 'production',
    mongoDBString: process.env.MONGODB_CONNECTION_STRING || '',
    port: process.env.PORT || '',
    exchange: process.env.EXCHANGE || '',
    redirectRoutingKey: process.env.REDIRECT_ROUTING_KEY || '',
    messageBrokerUrl: process.env.MESSAGE_BROKER_URL || '',
    queue: process.env.QUEUE || '',
  }
}

export default production
