'use client'
import { listChat } from '@/api/chat/list-chat'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { createContext, ReactNode, useContext } from 'react'

export interface Message {
  id: string
  userId: string
  message: string | null | undefined
  createdAt: string
  isImage: string | null | undefined
  imageUrl: string | null | undefined
}

export interface ListChatType {
  chatId: string
  messages: Message[]
  friend: {
    id: string
    name: string
  }
}

interface ChatContextProps {
  chatId: string | undefined
  statusQuerry: 'error' | 'success' | 'pending'
  data: ListChatType | undefined
}

const ChatContextContext = createContext({} as ChatContextProps)

export function ChatContextProvide({ children }: { children: ReactNode }) {
  const { chatId } = useParams<{ chatId: string }>()

  const { data, status } = useQuery<ListChatType>({
    queryKey: ['/list-chat', chatId],
    queryFn: async () => {
      const data = await listChat({ chatId })

      return data
    },
  })

  const values: ChatContextProps = {
    chatId: data?.chatId,
    data,
    statusQuerry: status,
  }

  return (
    <ChatContextContext.Provider value={values}>
      {children}
    </ChatContextContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContextContext)

  return context
}
