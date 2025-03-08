import { api } from '@/lib/api'

interface CreateNewMessageWithImageRequest {
  chatId: string
  message: string | null
  isDocument?: boolean
  urlDocumentOrImage: string
}

export async function createNewMessageWithImageDocument({
  chatId,
  message,
  isDocument = false,
  urlDocumentOrImage,
}: CreateNewMessageWithImageRequest) {
  if (message) {
    const { data } = await api.post('/message/file', {
      message,
      chatId,
      isDocument,
      urlDocumentOrImage,
    })

    return data
  }

  const { data } = await api.post('/message/file', {
    chatId,
    isDocument,
    urlDocumentOrImage,
  })

  return data
}
