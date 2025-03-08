import { api } from '@/lib/api'

interface UploadRequest {
  file: File
}

export async function upload({ file }: UploadRequest) {
  const formData = new FormData()

  formData.set('file', file)

  const { data } = await api.post('/upload-file', formData)
  return data
}
