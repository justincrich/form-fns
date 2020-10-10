import { ApiClient, FBEnvironmentMetadata, FBMembership } from './ApiClient'
import { DB_ENVIRONMENTS_KEY, DB_MEMBERS_KEY } from './paths'

export interface User {
    uid: string
    envKey: string
    envId: string
    image: string | null
    name: {
        first: string
        last: string
    }
    contact: {
        email: string | null
    }
    permissions: {
        [key: string]: boolean
    }
}

export interface Member {
    name: {
        firstName: string
        lastName: string
    }
    email?: string
    image?: string
    uid: string
}

export class MembershipClient extends ApiClient {
    getMembership = async (
        envId: string,
        uid: string,
        config: { email?: string } = {}
    ): Promise<User> => {
        const { permissions, key: envKey } = await this._getOnce<
            FBEnvironmentMetadata
        >(`${DB_ENVIRONMENTS_KEY}/${envId}/metadata`)

        const { firstName, lastName, email, image } = await this._getOnce<
            FBMembership
        >(`${DB_ENVIRONMENTS_KEY}/${envId}/${DB_MEMBERS_KEY}/${uid}`)

        const userPermissions: User['permissions'] = {}
        if (permissions.manager[uid]) {
            userPermissions.manager = true
        }
        return {
            uid,
            envKey,
            envId,
            image: image || null,
            contact: {
                email: config.email || email || null,
            },
            name: {
                first: firstName,
                last: lastName,
            },
            permissions: userPermissions,
        }
    }
}
