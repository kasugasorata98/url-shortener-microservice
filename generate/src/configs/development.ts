import { Config } from './index'

const development = (): Config => {
  return {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '',
    mongoDBString: process.env.MONGODB_CONNECTION_STRING || '',
    exchange: process.env.EXCHANGE || '',
    redirectRoutingKey: process.env.REDIRECT_ROUTING_KEY || '',
    messageBrokerUrl: process.env.MESSAGE_BROKER_URL || '',
    queue: process.env.QUEUE || '',
  }
}

export default development
