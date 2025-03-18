'use client'
import { useAuth } from '@/context/auth-context'
import { Notification } from './notification'
import { LogOut } from 'lucide-react'
import { useMediaQuery } from 'usehooks-ts'
import { useSocket } from '@/context/users-socket'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Pen } from '@phosphor-icons/react'

export function User() {
  const { user, logout } = useAuth()
  const { disconnectSocket } = useSocket()
  const lgMediaMobile = useMediaQuery('(max-width: 1023px)', {
    defaultValue: false,
    initializeWithValue: false,
  })

  return (
    <div className="w-full h-[65px] px-4 shadow-xl lg:justify-start flex items-center justify-between gap-2">
      <div></div>
      <div className="flex items-center gap-2 ">
        {!lgMediaMobile && <Notification />}

        <DropdownMenu>
          <DropdownMenuTrigger className="overflow-hidden rounded-full">
            <Avatar>
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-zinc-900/10 animate-pulse"></AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[220px]">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar>
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="bg-zinc-900/10 animate-pulse"></AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                href={'/profile/edit'}
                className="flex items-center cursor-pointer gap-2"
              >
                <Pen className="size-5" />
                <p>Edit profile</p>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                logout()
                disconnectSocket()
              }}
              className="flex items-center cursor-pointer gap-2"
            >
              <LogOut className="size-5" />
              <p>logout</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
