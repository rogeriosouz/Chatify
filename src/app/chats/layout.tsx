import { UsersSocketProvider } from '@/context/users-socket'
import { Toaster } from '@/components/ui/sonner'
import { ChatContextProvide } from '@/context/chat-context'
import { Friends } from './components/friends'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UsersSocketProvider>
      <ChatContextProvide>
        <div className="w-full grid grid-cols-1 h-screen">
          <div className="grid lg:grid-cols-1 grid-cols-[400px,1fr]">
            <Friends />

            <div className="w-full flex">{children}</div>
          </div>
        </div>

        <Toaster position="top-center" />
      </ChatContextProvide>
    </UsersSocketProvider>
  )
}
