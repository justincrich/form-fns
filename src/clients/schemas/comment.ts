import { Record, Number, String, Static } from 'runtypes'

export const DbCommentContentSchema = Record({
    message: String,
})

export const DbCommentMetadataSchema = Record({
    createdAt: Number,
    updatedAt: Number,
    createdBy: String,
})

export const DbCommentSchema = Record({
    content: DbCommentContentSchema,
    metadata: DbCommentMetadataSchema,
})

export type DbCommentContent = Static<typeof DbCommentContentSchema>
export type DbCommentMetadata = Static<typeof DbCommentMetadataSchema>
export type DbComment = Static<typeof DbCommentSchema>
