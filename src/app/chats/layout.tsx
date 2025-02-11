import { UsersSocketProvider } from '@/context/users-socket'
import { ListFriends } from '../components/list-friends'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <UsersSocketProvider>
        <header className="w-full bg-secondary h-[8vh] flex items-center justify-between px-40 xl:px-5">
          <div className="text-2xl font-black">LOGO</div>

          <nav className="flex items-center gap-2">
            <Button variant={'outline'} className="flex h-[40px] items-center">
              <LogOut className="size-5" />
              Sair
            </Button>
          </nav>
        </header>

        <div className="w-full pt-20 px-40 xl:px-5">
          <div className="grid rounded border shadow-xl overflow-hidden grid-cols-[350px,1fr] h-[650px]">
            <ListFriends />

            <div className="w-full flex">{children}</div>
          </div>
        </div>
      </UsersSocketProvider>
    </>
  )
}
