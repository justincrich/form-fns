export interface AppTheme {
    colors: {
        brand: {
            primary: string
            alt: string
            muted: string
        }
        background: {
            app: string
            content: string
        }
        border: {
            primary: string
        }
        text: {
            primary: string
            muted: string
            inverted: string
        }
        link: {
            primary: string
        }
        input: {
            label: string
        }
        status: {
            success: string
            error: string
            warning: string
            passive: string
        }
        icon: {
            primary: string
            muted: string
            inverted: string
            activity: string
            activityMuted: string
        }
    }
    fontFamily: {
        text: string
    }
    fontSizes: {
        sub: string
        label: string
        paragraph: string
        title: string
        h3: string
        h2: string
        h1: string
    }
}
export type ThemedProps = { theme: AppTheme }
const BLUE = '#2E5BFF'
const BLUE_MUTED = '#D5DEFF'
const WHITE = '#FFFFFF'
const MUTED_GRAY = '#F4F6FC'
const LABEL_GRAY = '#B0BAC9'
const YELLOWISH = '#ffd22e'
const GRAY = '#6c757d'

export const theme: AppTheme = {
    colors: {
        brand: {
            primary: BLUE,
            alt: YELLOWISH,
            muted: BLUE_MUTED,
        },
        icon: {
            activity: BLUE,
            activityMuted: BLUE_MUTED,
            inverted: WHITE,
            muted: '#8798AD',
            primary: '#2E384D',
        },
        background: {
            app: MUTED_GRAY,
            content: WHITE,
        },
        border: {
            primary: '#E0E7FF',
        },
        text: {
            primary: '#2E384D',
            muted: '#8798AD',
            inverted: '#FFFFFF',
        },
        link: {
            primary: '#2E5BFF',
        },
        input: {
            label: LABEL_GRAY,
        },
        status: {
            success: '#33AC2E',
            error: '#D63649',
            warning: '#F7C137',
            passive: GRAY,
        },
    },
    fontFamily: {
        text: "'Rubik', sans-serif",
    },
    fontSizes: {
        h1: '48px',
        h2: '34px',
        h3: '28px',
        title: '15px',
        paragraph: '15px',
        label: '12px',
        sub: '10px',
    },
}
