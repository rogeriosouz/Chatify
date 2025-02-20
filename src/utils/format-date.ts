export function formatDate(date: string) {
  const dateDate = new Date(date)

  const dateFormat = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateDate)

  return dateFormat
}
