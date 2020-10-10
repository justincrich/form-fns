const missing = (title): never => {
    console.log(process.env.REACT_APP_SITE_TITLE)
    const message = `${title} missing`
    console.error(message)
    throw new Error(message)
}

export const SITE_TITLE =
    process.env.REACT_APP_SITE_TITLE || missing('SITE_TITLE')
export const BASE_DOMAIN =
    process.env.REACT_APP_BASE_DOMAIN || missing('BASE_DOMAIN')
