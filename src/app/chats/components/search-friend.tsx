import { Input } from '@/components/ui/input'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useDebounceValue } from 'usehooks-ts'

export function SearchFriend() {
  const { push } = useRouter()
  const [search, setSearch] = useDebounceValue('', 500)

  useEffect(() => {
    if (search === '') {
      push(`?search=`)
      return
    }
    push(`?search=${search}`)
  }, [search])

  return (
    <div className="w-full px-5 mb-3">
      <label className="relative block rounded-md w-full">
        <MagnifyingGlass className="size-5 absolute left-3 top-1/2 text-zinc-500 -translate-y-1/2 z-10" />
        <Input
          onChange={(event) => {
            const value = event.target.value
            setSearch(value)
          }}
          placeholder="Find friend"
          className="pl-10 bg-white rounded-full"
        />
      </label>
    </div>
  )
}
