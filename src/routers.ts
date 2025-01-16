export const APP_ROUTER = {
  private: {
    home: '/',
  },

  auth: {
    loin: '/auth/loin',
    register: '/auth/register',
    forgotPassword: '/auth/forgotPassword',
    recoveryPassword: '/auth/recoveryPassword/',
  },
}

export function routersType(routerPath: string): string {
  const privateRouter = Object.values(APP_ROUTER.private)
  const auth = Object.values(APP_ROUTER.auth)

  if (privateRouter.includes(routerPath)) {
    return 'private'
  } else if (auth.includes(routerPath) || routerPath.includes('/auth/')) {
    return 'auth'
  } else {
    return 'public'
  }
}

export function getAllRoutersMiddleware(): string[] {
  const allRouter = Object.values(APP_ROUTER.private).concat(
    Object.values(APP_ROUTER.auth),
  )

  return allRouter
}
