import { AppTheme } from '../theme'

type FontSize = keyof AppTheme['fontSizes']
type FontColor = keyof AppTheme['colors']['text']
type FontFamily = keyof AppTheme['fontFamily']

const getLineHeightPx = (size: FontSize): number => {
    switch (size) {
        case 'h1':
            return 57
        case 'h2':
            return 32
        case 'h3':
            return 32
        case 'title':
            return 18
        case 'label':
            return 14
        case 'sub':
            return 10
        default:
            return 22
    }
}

const getWeight = (size: FontSize): number => {
    switch (size) {
        case 'h1':
        case 'h2':
        case 'h3':
            return 300
        case 'title':
            return 500
        default:
            return 400
    }
}

export const text = (
    size: FontSize = 'paragraph',
    color: FontColor = 'primary',
    family: FontFamily = 'text'
) => ({ theme }: { theme: AppTheme }): string => {
    const lineHeightPx = getLineHeightPx(size)
    const weight = getWeight(size)
    return `
        color: ${theme.colors.text[color]};
        font-size: ${theme.fontSizes[size]};
        font-family: ${theme.fontFamily[family]};
        line-height: ${lineHeightPx}px;
        font-weight: ${weight};
    `
}
