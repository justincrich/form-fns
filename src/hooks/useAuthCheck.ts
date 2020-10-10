import { useSelector, shallowEqual } from 'react-redux'
import isEqual from 'lodash/isEqual'
import {
    selectUser,
    selectUserError,
    selectUserLoading,
} from '../services/user'

export const useAuthCheck = (): boolean => {
    const user = useSelector(selectUser, isEqual)
    const userError = useSelector(selectUserError, isEqual)
    const isLoading = useSelector(selectUserLoading, shallowEqual)

    return Boolean(!isLoading && !userError && user)
}
