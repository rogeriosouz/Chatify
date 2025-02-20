import { UsersSocketProvider } from '@/context/users-socket'
import { Header } from './components/header'
import { ListFriends } from './components/list-friends'
import { Toaster } from '@/components/ui/sonner'
import { ChatContextProvide } from '@/context/chat-context'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UsersSocketProvider>
      <ChatContextProvide>
        <div className="w-full h-screen flex flex-col">
          <Header />

          <div className="w-full lg:h-[92vh] pt-20 px-40 lg:px-0 xl:px-5 lg:pt-0">
            <div className="grid lg:grid-cols-1 rounded border shadow-xl overflow-hidden grid-cols-[350px,1fr] lg:h-full h-[650px]">
              <ListFriends />

              <div className="w-full h-full flex">{children}</div>
            </div>
          </div>
        </div>

        <Toaster position="top-center" />
      </ChatContextProvide>
    </UsersSocketProvider>
  )
}
