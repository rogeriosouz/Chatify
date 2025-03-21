'use client'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useAuth } from './auth-context'
import { querryClient } from '@/lib/react-querry'
import { useParams } from 'next/navigation'

interface UsersSocketContextType {
  socket: WebSocket | null
  connectSocket: (userId: string) => void
  disconnectSocket: () => void
  usersOnline: string[] | null
  notificationNewMessage:
    | {
        userId: string
        nameUser: string
        isImage: string | null | undefined
        isDocument: string | null | undefined
        imageUserUrl: string
      }[]
    | null
  notificationAcceptedFriend: {
    nameUser: string
    imageUserUrl: string
  } | null
  notificationNewFriendsRequest: {
    userId: string
    nameUser: string
    imageUserUrl: string
  } | null
  newMessages: {
    id: string
    userId: string
    message: string
    createdAt: string
    chatId: string
    isImage: string | null | undefined
    isDocument: string | null | undefined
    urlDocumentOrImage: string | null | undefined
  } | null
  sendAcceptedFriend: ({
    recipientId,
    name,
  }: {
    recipientId: string
    name: string
  }) => void
  sendRequestFriend: ({
    recipientId,
    name,
  }: {
    recipientId: string
    name: string
  }) => void
  sendMessage: ({
    recipientId,
    message,
    chatId,
    nameUser,
    isImage,
    isDocument,
    urlDocumentOrImage,
    imageUserUrl,
  }: {
    recipientId: string
    message: string
    chatId: string
    nameUser: string
    isImage: string | null | undefined
    isDocument: string | null | undefined
    urlDocumentOrImage: string | null | undefined
    imageUserUrl: string
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
    isImage: string | null | undefined
    isDocument: string | null | undefined
    urlDocumentOrImage: string | null | undefined
  } | null>(null)
  const { chatId } = useParams()

  const [notificationNewMessage, setNotificationNewMessage] = useState<
    | null
    | {
        userId: string
        nameUser: string
        isImage: string | null | undefined
        isDocument: string | null | undefined
        imageUserUrl: string
      }[]
  >(null)

  const [notificationNewFriendsRequest, setNotificationNewFriendsRequest] =
    useState<{
      userId: string
      nameUser: string
      imageUserUrl: string
    } | null>(null)

  const [notificationAcceptedFriend, setNotificationAcceptedFriend] = useState<{
    nameUser: string
    imageUserUrl: string
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user, newMessages])

  function sendMessage({
    recipientId,
    message,
    chatId,
    nameUser,
    isImage,
    isDocument,
    urlDocumentOrImage,
    imageUserUrl,
  }: {
    recipientId: string
    message: string
    chatId: string
    nameUser: string
    isImage: string | null | undefined
    isDocument: string | null | undefined
    urlDocumentOrImage: string | null | undefined
    imageUserUrl: string
  }) {
    socket?.send(
      JSON.stringify({
        recipientId,
        action: 'messageChat',
        chatId,
        nameUser,
        message,
        isImage,
        isDocument,
        urlDocumentOrImage,
        imageUserUrl,
      }),
    )
  }

  function sendRequestFriend({
    recipientId,
    name,
  }: {
    recipientId: string
    name: string
  }) {
    socket?.send(
      JSON.stringify({
        recipientId,
        nameUser: name,
        userId: user?.id,
        action: 'requestFriend',
      }),
    )
  }

  function sendAcceptedFriend({
    recipientId,
    name,
  }: {
    recipientId: string
    name: string
  }) {
    socket?.send(
      JSON.stringify({
        recipientId,
        action: 'acceptedFriend',
        nameUser: name,
      }),
    )
  }

  useEffect(() => {
    if (newMessages && !chatId) {
      setNewMessages(null)
    }
  }, [newMessages, chatId])

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
        nameUser?: string
        isImage: string | null | undefined
        isDocument: string | null | undefined
        urlDocumentOrImage: string | null | undefined
        imageUserUrl: string | null | undefined
      }

      switch (data.action) {
        case 'messageChat':
          if (data.recipientId === user?.id) {
            setNewMessages({
              id: 'id provisório',
              userId: data.userId,
              message: data.message,
              createdAt: new Date().toString(),
              chatId: data.chatId,
              isDocument: data.isDocument,
              isImage: data.isImage,
              urlDocumentOrImage: data.urlDocumentOrImage,
            })
          }

          break
        case 'newMessageChat':
          if (data.recipientId === user?.id) {
            setNotificationNewMessage(
              notificationNewMessage
                ? [
                    ...notificationNewMessage,
                    {
                      userId: data.userId,
                      nameUser: data.nameUser as string,
                      isImage: data.isImage,
                      isDocument: data.isDocument,
                      imageUserUrl: data.imageUserUrl as string,
                    },
                  ]
                : [
                    {
                      userId: data.userId,
                      nameUser: data.nameUser as string,
                      isImage: data.isImage,
                      isDocument: data.isDocument,
                      imageUserUrl: data.imageUserUrl as string,
                    },
                  ],
            )
          }

          break
        case 'requestFriend':
          if (data.recipientId === user?.id) {
            setNotificationNewFriendsRequest({
              nameUser: data.nameUser as string,
              userId: data.userId,
              imageUserUrl: data.imageUserUrl as string,
            })

            querryClient.invalidateQueries({
              queryKey: ['/friends-request'],
              type: 'all',
            })
          }

          break
        case 'acceptedFriend':
          if (data.recipientId === user?.id) {
            querryClient.invalidateQueries({
              queryKey: ['/friends'],
              type: 'all',
            })

            setNotificationAcceptedFriend({
              nameUser: data.nameUser as string,
              imageUserUrl: data.imageUserUrl as string,
            })
          }
          break
        case 'connectedUsers':
          if (data.users) {
            if (!socket && user) {
              connectSocket(user.id)
            }

            setUsersOnline(data.users)
          }

          break
      }
    }
  }

  function disconnectSocket() {
    socket?.close()
  }

  const values = {
    usersOnline,
    socket,
    connectSocket,
    disconnectSocket,
    sendMessage,
    newMessages,
    notificationNewMessage,
    sendRequestFriend,
    notificationNewFriendsRequest,
    sendAcceptedFriend,
    notificationAcceptedFriend,
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
