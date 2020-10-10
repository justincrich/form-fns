import { Record, String, Static, Partial, Literal } from 'runtypes'

export const DbEnvironmentListingSchema = Record({
    id: String,
    name: String,
})

export const DbPermissionsSchema = Record({}).And(
    Partial({
        manager: Literal(true),
    })
)

export const DbEnvironmentMetadataSchema = Record({
    key: String,
    name: String,
    permissions: DbPermissionsSchema,
})

export type DbPermissions = Static<typeof DbPermissionsSchema>
export type DbEnvironmentMetadata = Static<typeof DbEnvironmentMetadataSchema>
export type DbEnvironmentListing = Static<typeof DbEnvironmentListingSchema>
