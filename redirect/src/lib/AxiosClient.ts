import axios from 'axios'

const AxiosClient = () => {
  const axiosInstance = axios.create({})
  axiosInstance.interceptors.request.use(request => {
    return request
  })
  axiosInstance.interceptors.response.use(response => {
    return response
  })
  return axiosInstance
}

export default AxiosClient()
