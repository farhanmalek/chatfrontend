export type UserProfileToken = {
    id: string,
    userName: string,
    email: string,
    token: string
}

export type UserProfile = {
    userId: string,
    userName: string,
    email?: string,
}
