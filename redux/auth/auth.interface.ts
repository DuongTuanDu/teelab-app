export interface ICustomer {
    _id: string,
    username: string,
    email: string
    avatar: {
        url: string
        publicId?: string
    }
}

export interface IAuthState {
    customer: ICustomer | null,
    isAuthenticated: boolean
}