'use client'
import { SendMessage } from './send-message'
import { HeaderChat } from './header-chat'
import { MobileHeader } from '../../components/mobile-header'
import { ListMessages } from './list-messages'

export function Chat() {
  return (
    <>
      <div className="min-w-full  h-screen flex flex-col">
        <MobileHeader />

        <HeaderChat />

        <ListMessages />

        <SendMessage />
      </div>
    </>
  )
}
