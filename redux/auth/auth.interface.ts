export interface IUser {
    _id: string,
    username: string,
    email: string
    avatar: {
        url: string
        publicId?: string
    }
}

export interface IAuthState {
    customer: IUser | null,
    isAuthenticated: boolean
}