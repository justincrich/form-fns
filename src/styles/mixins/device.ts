import { css, CSSObject, SimpleInterpolation } from 'styled-components'

export const MaxWidthBreakpoints = {
    mobile: 375,
    tablet: 768,
    laptop: 1280,
} as const

// @ts-ignore
const mediaQuery = (maxWidthPx: number): typeof css => (
    fragments: CSSObject | TemplateStringsArray,
    ...interpolations: SimpleInterpolation[]
) => css`
    @media (max-width: ${maxWidthPx}px) {
        ${css(fragments, ...interpolations)}
    }
`

export const device = {
    mobile: mediaQuery(MaxWidthBreakpoints.mobile),
    tablet: mediaQuery(MaxWidthBreakpoints.tablet),
    laptop: mediaQuery(MaxWidthBreakpoints.laptop),
}
