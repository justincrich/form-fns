export const MEMBERSHIP = {
    NOT_A_MEMBER: (uid: string) => `You are not a member`,
}

export const AUTH = {
    NOT_LOGGED_IN: () => 'Access denied',
    ACCESS_DENIED: () => 'Access denied',
}

export const ENVIRONMENT = {
    NOT_EXIST: (eid?: string) =>
        !eid
            ? `required`
            : `ID <strong>${eid}</strong> is an invalid environment`,
}

export const API = {
    NOT_FOUND: () => `Not found`,
}
