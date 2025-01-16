import { refreshToken } from '@/api/refresh-token'
import { JwtResponse } from '@/context/auth-context'
import { env } from '@/env/local'
import axios from 'axios'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { decode } from 'jsonwebtoken'

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_URL_BACKEND,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = getCookie('auth-token:front-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const data = await refreshToken()

        const { exp } = decode(data.token) as JwtResponse

        const expirationTimestampInSeconds = exp
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000)

        const timeRemainingInSeconds =
          expirationTimestampInSeconds - currentTimestampInSeconds
        const timeRemainingInMilliseconds = timeRemainingInSeconds * 1000

        const expires = new Date(Date.now() + timeRemainingInMilliseconds)

        setCookie('auth-token:front-token', data.token, {
          expires,
        })

        api.defaults.headers.Authorization = `Bearer ${data.token}`
        originalRequest.headers.Authorization = `Bearer ${data.token}`

        onTokenRefreshed(data.token)

        return api(originalRequest)
      } catch (refreshError) {
        deleteCookie('auth-token:front-token')
        deleteCookie('refresh-token')

        window.location.href = '/auth/login'

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)
