import { Metadata } from 'next'
import { ChatsContainer } from './components/chats-container'

export const metadata: Metadata = {
  title: 'home ',
}

export default function Chats() {
  return <ChatsContainer />
}
