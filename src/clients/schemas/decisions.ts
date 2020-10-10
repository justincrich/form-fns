import {
    Record,
    Number,
    Literal,
    Static,
    Dictionary,
    Boolean,
    Partial,
    String,
} from 'runtypes'

export const DbVoteValueSchema = Literal('YES')
    .Or(Literal('NO'))
    .Or(Literal('ABSTAIN'))

export const DbVoteSchema = Record({
    value: DbVoteValueSchema,
    createdAt: Number,
    updatedAt: Number,
})

export const DbDecisionSchema = Record({
    createdAt: Number,
    updatedAt: Number,
    title: String,
}).And(
    Partial({
        votes: Dictionary(DbVoteSchema),
        votingStartedAt: Number,
        votingEndedAt: Number,
        canAbstain: Boolean,
    })
)

export type DbDecision = Static<typeof DbDecisionSchema>

export type DbVote = Static<typeof DbVoteSchema>

export type DbVoteValue = Static<typeof DbVoteValueSchema>
