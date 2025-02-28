import { api } from '@/lib/api'

interface CreateNewMessageWithImageRequest {
  chatId: string
  message: string | null
  isDocument?: boolean
  file: File
}

export async function createNewMessageWithImageDocument({
  chatId,
  file,
  message,
  isDocument = false,
}: CreateNewMessageWithImageRequest) {
  const bodyFormData = new FormData()
  bodyFormData.set('file', file)
  bodyFormData.set('chatId', chatId)

  if (isDocument) {
    bodyFormData.set('isDocument', JSON.stringify(isDocument))
  }

  if (message) {
    bodyFormData.set('message', message)
  }

  const { data } = await api.post('/messages-chat-with-image', bodyFormData)

  return data
}
