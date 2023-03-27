import development from './development'
import production from './production'
import staging from './staging'
import dotenv from 'dotenv'
dotenv.config()

export interface Config {
  mongoDBString: string
  environment: string
  port: string
  exchange: string
  messageBrokerUrl: string
  redirectQueue: string
  redirectRoutingKey: string
  reportRoutingKey: string
}

export const config = (() => {
  switch (process.env.NODE_ENV || 'development') {
    case 'prod':
    case 'production': {
      return production()
    }
    case 'stag':
    case 'staging': {
      return staging()
    }
    case 'dev':
    case 'development': {
      return development()
    }
    default: {
      return development()
    }
  }
})()
