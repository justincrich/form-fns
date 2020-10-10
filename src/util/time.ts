import isToday from 'date-fns/isToday'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import format from 'date-fns/format'

export const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    if (isToday(date)) {
        return formatDistanceToNow(date)
    }
    return format(date, 'M/d/yyyy')
}
