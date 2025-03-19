import { Socket } from "socket.io-client";
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
    authLoading: boolean,
    emailVerify: string,
    isResetPassword: boolean,
    userInfo?: {},
    socket: Socket | null
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

export interface IAccount {
    name: string;
    email: string;
    password?: string;
    rePassword?: string;
}

export interface IAccountResponse {
    success: boolean,
    message: string,
    data: {
        _id: string,
        name: string,
        email: string,
        password: string,
        avatar: {
            url: string,
            publicId?: string
        },
        isActive: boolean,
        wishlist?: string[],
        createdAt?: string,
        updatedAt?: string,
        __v?: number
    }
}