type SuccessResponse<T> = {
    success: true,
    data: T
}

type FailureResponse = {
    success: false,
    message: string
}

export type Response<T> = SuccessResponse<T> | FailureResponse;