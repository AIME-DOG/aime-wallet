
export interface StandardResponse<T = any> {
  code: number
  msg: string
  data: T | null
}

export function successResponse<T>(data: T): StandardResponse<T> {
  return {
    code: 0,
    msg: 'success',
    data
  }
}

export function errorResponse(message: string): StandardResponse<null> {
  return {
    code: -1,
    msg: message,
    data: null
  }
}

export function wrapHandler<T>(handler: () => Promise<T>) {
  return async (): Promise<StandardResponse<T | null>> => {
    try {
      const result = await handler()
      return successResponse(result)
    } catch (error) {
      console.error('wrapHandler error', error)
      return errorResponse(error instanceof Error ? error.message : 'Unknown error')
    }
  }
} 