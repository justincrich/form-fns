import { AuthClient } from '../clients/AuthClient'

let client: AuthClient | null = null

export const useAuthClient = (): AuthClient => {
    if (!client) {
        client = new AuthClient()
    }
    return client
}
