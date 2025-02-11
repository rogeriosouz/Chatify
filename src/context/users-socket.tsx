'use client'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useAuth } from './auth-context'

interface UsersSocketContextType {
  socket: WebSocket | null
  connectSocket: (userId: string) => void
  disconnectSocket: () => void
  usersOnline: string[] | null
  newMessages: {
    id: string
    userId: string
    message: string
    createdAt: string
    chatId: string
  } | null
  sendMessage: ({
    recipientId,
    message,
    chatId,
  }: {
    recipientId: string
    message: string
    chatId: string
  }) => void
}

const UsersSocketContext = createContext({} as UsersSocketContextType)

export function UsersSocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [usersOnline, setUsersOnline] = useState<string[] | null>(null)
  const [newMessages, setNewMessages] = useState<{
    id: string
    userId: string
    message: string
    createdAt: string
    chatId: string
  } | null>(null)

  useEffect(() => {
    const usersOnlineLocalhost = localStorage.getItem('usersOnline')
      ? (JSON.parse(localStorage.getItem('usersOnline') as string) as string[])
      : null

    setUsersOnline(() => usersOnlineLocalhost)
  }, [])

  useEffect(() => {
    localStorage.setItem('usersOnline', JSON.stringify(usersOnline))
  }, [usersOnline])

  useEffect(() => {
    if (!socket && user) {
      connectSocket(user.id)
    }
  }, [user])

  function sendMessage({
    recipientId,
    message,
    chatId,
  }: {
    recipientId: string
    message: string
    chatId: string
  }) {
    socket?.send(JSON.stringify({ recipientId, chatId, message }))
  }

  function disconnectSocket() {
    socket?.close()
  }

  function connectSocket(userId: string) {
    const socket = new WebSocket(`ws://localhost:3333/chats/ws/${userId}`)

    setSocket(socket)

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data) as {
        action: string
        recipientId: string
        userId: string
        message: string
        users?: string[]
        chatId: string
      }

      if (data.action === 'newMessageChat') {
        if (data.recipientId === user?.id) {
          setNewMessages({
            id: 'id provisório',
            userId: data.userId,
            message: data.message,
            createdAt: new Date().toString(),
            chatId: data.chatId,
          })
        }
      }

      if (data.action === 'connectedUsers' && data.users) {
        setUsersOnline(data.users)
      }
    }
  }

  const values = {
    usersOnline,
    socket,
    connectSocket,
    disconnectSocket,
    sendMessage,
    newMessages,
  }

  return (
    <UsersSocketContext.Provider value={values}>
      {children}
    </UsersSocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(UsersSocketContext)

  return context
}
