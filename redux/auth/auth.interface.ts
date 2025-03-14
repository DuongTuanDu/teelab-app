export interface ICustomer {
    _id: string,
    name:string,
    username: string,
    email: string
    avatar: {
        url: string
        publicId?: string
    }
    googleId?: string
    isActive: boolean
}

export interface IAuthState {
    customer: ICustomer | null,
    isAuthenticated: boolean,
    authLoading: boolean
}

export interface ILogin {
    success: boolean,
    accessToken: string,
    user: {
        id: string,
        name: string,
        email: string,
        avatar: {
            url: string,
            publicId?: string
        }
    }
}