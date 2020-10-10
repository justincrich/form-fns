import useMedia from 'use-media'
import { MaxWidthBreakpoints } from '../styles/mixins/device'

export const useTablet = (): boolean => {
    const isTablet = useMedia({ maxWidth: MaxWidthBreakpoints.tablet })
    return isTablet
}
