import {
    String,
    Record,
    Number,
    Boolean,
    Partial,
    Static,
    Dictionary,
    Array,
} from 'runtypes'
import { DbCommentSchema } from './comment'

export const DbTaskMetadataSchema = Record({
    updatedAt: Number,
    createdAt: Number,
    createdBy: String,
    name: String,
}).And(
    Partial({
        description: String,
        completed: Boolean,
        assigned: Dictionary(Boolean),
    })
)

export const DbTaskSchema = Record({
    metadata: DbTaskMetadataSchema,
    comments: Array(DbCommentSchema),
})

export type DbTaskMetadata = Static<typeof DbTaskMetadataSchema>

export type DbTask = Static<typeof DbTaskSchema>
