import { z } from 'zod'

const schemaEnv = z.object({
  NEXT_PUBLIC_URL_BACKEND: z.string(),
})

const envFromProcess = {
  NEXT_PUBLIC_URL_BACKEND: process.env.NEXT_PUBLIC_URL_BACKEND,
}

const _env = schemaEnv.safeParse(envFromProcess)

if (!_env.success) {
  console.error('Erro: Variáveis não encontradas', _env.error.format())
  throw new Error('Erro: Variáveis não encontradas')
}

export const env = _env.data
