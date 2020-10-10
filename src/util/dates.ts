import { format, isToday, formatDistanceToNow } from 'date-fns'

const parseDate = (dateOrTimestamp: number | Date): Date => {
    let date = dateOrTimestamp
    if (!(date instanceof Date)) {
        date = new Date(date)
    }
    return date
}

export const getFormattedDate = (dateOrTimestamp: number | Date): string => {
    return format(parseDate(dateOrTimestamp), 'M/d/yyyy')
}

export const getDistanceDate = (dateOrTimestamp: number | Date): string => {
    const date = parseDate(dateOrTimestamp)
    if (!isToday(date)) return getFormattedDate(date)
    return formatDistanceToNow(date)
}
