import { Record, Number, String, Static } from 'runtypes'

export const DbMemberSchema = Record({
    createdAt: Number,
    updatedAt: Number,
    firstName: String,
    lastName: String,
    uid: String,
})

export type DbMember = Static<typeof DbMemberSchema>
