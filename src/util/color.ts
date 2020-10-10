import color from 'color'

export const transformColorOpacity = (hex: string, opacity: number): string => {
    const mutableHex = hex.replace('#', '')
    const code = [
        parseInt(mutableHex.substring(0, 2), 16),
        parseInt(mutableHex.substring(2, 4), 16),
        parseInt(mutableHex.substring(4, 6), 16),
    ]

    return `rgba(${code.join(',')},${opacity})`
}
