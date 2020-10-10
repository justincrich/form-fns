/* eslint-disable no-restricted-globals */
import { useMemo } from 'react'
import queryString from 'query-string'
import { getUrlDomains, Domains } from './util'

export const useQueryString = <Queries = {}>(): Queries => {
    const { search } = window.location
    const queryParameters = useMemo<Queries>((): Queries => {
        // @ts-ignore
        return queryString.parse(search) as Queries
    }, [search])
    return queryParameters
}

export const useSubdomain = (): Domains => {
    const { host } = window.location
    const domainParts = useMemo<Domains>(() => getUrlDomains(host), [host])

    return domainParts
}
