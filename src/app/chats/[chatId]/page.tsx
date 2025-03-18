import { Metadata } from 'next'
import { Chat as ChatComponent } from './components/chat'
import { ChatContextProvide } from '@/context/chat-context'

export const metadata: Metadata = {
  title: 'Chat',
}

export default function Chat() {
  return (
    <ChatContextProvide>
      <ChatComponent />
    </ChatContextProvide>
  )
}
