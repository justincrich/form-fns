import { AppTheme } from './theme'

export const color = {
    brand: {
        primary: ({ theme }: { theme: AppTheme }) => theme.colors.brand.primary,
        muted: ({ theme }: { theme: AppTheme }) => theme.colors.brand.muted,
        alt: ({ theme }: { theme: AppTheme }) => theme.colors.brand.alt,
    },
    background: {
        app: ({ theme }: { theme: AppTheme }) => theme.colors.background.app,
        content: ({ theme }: { theme: AppTheme }) =>
            theme.colors.background.content,
    },
    border: {
        primary: ({ theme }: { theme: AppTheme }) =>
            theme.colors.border.primary,
    },
    text: {
        primary: ({ theme }: { theme: AppTheme }) => theme.colors.text.primary,
        muted: ({ theme }: { theme: AppTheme }) => theme.colors.text.muted,
        inverted: ({ theme }: { theme: AppTheme }) =>
            theme.colors.text.inverted,
    },
    icon: {
        primary: ({ theme }: { theme: AppTheme }) => theme.colors.icon.primary,
        inverted: ({ theme }: { theme: AppTheme }) =>
            theme.colors.icon.inverted,
        muted: ({ theme }: { theme: AppTheme }) => theme.colors.icon.muted,
        activity: ({ theme }: { theme: AppTheme }) =>
            theme.colors.icon.activity,
        activityMuted: ({ theme }: { theme: AppTheme }) =>
            theme.colors.icon.activityMuted,
    },
    link: {
        primary: ({ theme }: { theme: AppTheme }) => theme.colors.link.primary,
    },
    input: {
        label: ({ theme }: { theme: AppTheme }) => theme.colors.input.label,
    },
    status: {
        success: ({ theme }: { theme: AppTheme }) =>
            theme.colors.status.success,
        error: ({ theme }: { theme: AppTheme }) => theme.colors.status.error,
        warning: ({ theme }: { theme: AppTheme }) =>
            theme.colors.status.warning,
        passive: ({ theme }: { theme: AppTheme }) =>
            theme.colors.status.passive,
    },
}
