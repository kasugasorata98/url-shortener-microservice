import { config } from '../configs'

export const Utils = {
  isProd: (): boolean => {
    return config.environment === 'prod' || config.environment === 'production'
  },
  isStag: (): boolean => {
    return config.environment === 'stag' || config.environment === 'staging'
  },
  isDev: (): boolean => {
    return config.environment === 'dev' || config.environment === 'development'
  },
  sleep: (delay: number): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, delay)
    })
  },
  isObject: (value: any): boolean =>
    typeof value === 'object' && value !== null,
}
