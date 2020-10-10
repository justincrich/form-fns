export interface Domains {
    subdomain: string | null
    domain: string
}
export const getUrlDomains = (locationHost: string): Domains => {
    const parts = locationHost.split('.')
    if (parts.length < 2) {
        return {
            domain: parts[0],
            subdomain: null,
        }
    }
    const [subdomain, domain] = parts
    return {
        subdomain,
        domain,
    }
}
