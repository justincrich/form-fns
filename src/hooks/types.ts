export interface AsyncResult<Data> {
    data: Data
    isLoading: boolean
    error: Error | null
}
