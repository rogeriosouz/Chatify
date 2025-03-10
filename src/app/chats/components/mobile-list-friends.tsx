'use client'
import {
  SheetTrigger,
  SheetContent,
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { Friends } from './friends'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function MobileListFriends() {
  const [open, setOpen] = useState(false)
  const path = usePathname()

  useEffect(() => {
    if (open) {
      setOpen(false)
    }
  }, [path])

  return (
    <Sheet open={open} onOpenChange={(value) => setOpen(value)}>
      <SheetTrigger>
        <ArrowLeft className="size-6 text-primary" />
      </SheetTrigger>
      <SheetContent side={'left'} className="bg-secondary !p-0 !w-full">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <Friends isMobile />
      </SheetContent>
    </Sheet>
  )
}
