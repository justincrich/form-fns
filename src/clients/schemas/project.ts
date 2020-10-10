import {
    Record,
    Number,
    String,
    Undefined,
    Null,
    Static,
    Literal,
    Array,
    Partial,
    Dictionary,
} from 'runtypes'
import { DbCommentSchema } from './comment'
import { DbTaskSchema } from './task'
import { DbDecisionSchema } from './decisions'

export const DbStatusSchema = Literal('OPEN')
    .Or(Literal('VOTING'))
    .Or(Literal('IN_PROGRESS'))
    .Or(Literal('ARCHIVED'))
    .Or(Literal('COMPLETE'))
    .Or(Literal('APPROVED'))

export const DbProjectMetadataSchema = Record({
    createdAt: Number,
    createdBy: String,
    name: String,
    status: DbStatusSchema,
    updatedAt: Number,
}).And(
    Partial({
        description: String.Or(Undefined).Or(Null),
    })
)

export const DbProjectSchema = Record({
    metadata: DbProjectMetadataSchema,
    comments: Array(DbCommentSchema),
}).And(
    Partial({
        tasks: Dictionary(DbTaskSchema),
        decisions: Dictionary(DbDecisionSchema),
    })
)

export const DbProjectListSchema = Dictionary(DbProjectSchema)

export type DbStatus = Static<typeof DbStatusSchema>
export type DbProjectMetadata = Static<typeof DbProjectMetadataSchema>
export type DbProject = Static<typeof DbProjectSchema>
export type DbProjectList = Static<typeof DbProjectListSchema>
