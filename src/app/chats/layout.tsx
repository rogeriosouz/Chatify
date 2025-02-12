import { UsersSocketProvider } from '@/context/users-socket'
import { ListFriends } from '../components/list-friends'
import { Header } from './components/header'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UsersSocketProvider>
      <Header />

      <div className="w-full pt-20 px-40 xl:px-5">
        <div className="grid rounded border shadow-xl overflow-hidden grid-cols-[350px,1fr] h-[650px]">
          <ListFriends />

          <div className="w-full flex">{children}</div>
        </div>
      </div>
    </UsersSocketProvider>
  )
}
