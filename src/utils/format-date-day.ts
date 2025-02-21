export function formatDateDay(date: string) {
  const inputDate = new Date(date)
  const today = new Date()

  today.setHours(0, 0, 0, 0)
  inputDate.setHours(0, 0, 0, 0)

  const diffTime = inputDate.getTime() - today.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  if (diffDays === 0) return 'Hoje'
  if (diffDays === -1) return 'Ontem'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
  }).format(inputDate)
}
