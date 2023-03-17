export interface Logs {
  endpoint?: string
  method?: string
  message?: string
  functionName?: string
  request?: any
  response?: any
  traces: Array<
    | string
    | {
        [key: string]: any
      }
  >
}
