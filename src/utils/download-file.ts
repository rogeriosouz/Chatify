export async function downloadFile({ fileUrl }: { fileUrl: string }) {
  try {
    const response = await fetch(fileUrl)

    if (!response.ok) {
      throw new Error('Falha ao baixar o arquivo')
    }

    const blob = await response.blob()

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = ''

    link.click()

    URL.revokeObjectURL(link.href)
  } catch (error) {
    console.error('Erro ao baixar o arquivo:', error)
  }
}
