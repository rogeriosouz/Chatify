import { Button } from '@/components/ui/button'
import { Frown } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
      <Frown className="w-16 h-16 text-primary" />
      <h1 className="text-4xl font-bold text-gray-800 mt-4">Page Not Found</h1>
      <p className="text-gray-600 mt-2">
        Oops! The page you are looking for does not exist.
      </p>

      <Button className="mt-6 px-6 py-3" asChild>
        <Link href={'/'}>Go Back Home</Link>
      </Button>
    </div>
  )
}
