export interface IProvince {
    ProvinceID: number,
    ProvinceName: string,
    Code: string,
}

export interface IDistrict {
    DistrictID: number
    ProvinceID: number
    DistrictName: string
    Code: string
}

export interface IWard {
    WardCode: string
    DistrictID: number
    WardName: string
}

export interface IOrder {
    _id: string,
    user: string,
    products: {
        productId: string,
        name: string,
        image: string,
        size: string,
        color: string | null,
        price: string,
        quantity: number,
        isReviewed: boolean
    }[],
    status: "pending" | "processing" | "shipping" | "delivered" | "cancelled",
    province: {
        id: number,
        name: string,
    },
    district: {
        id: number,
        name: string,
    },
    ward: {
        id: string,
        name: string,
    },
    phone: string,
    address: string,
    paymentMethod: "COD" | "STRIPE" | "VNPAY",
    note: string,
    totalAmount: number,
    createdAt: string,
    updatedAt: string
}

export interface IPayloadOrder {
    products: {
        productId: string,
        name: string,
        image: string,
        size: string,
        color?: string,
        price: string,
        quantity: number,
        isReviewed: boolean
    }[],
    province: {
        id: number,
        name: string,
    },
    district: {
        id: number,
        name: string,
    },
    ward: {
        id: string,
        name: string,
    },
    phone: string,
    address: string,
    paymentMethod: "COD" | "STRIPE" | "VNPAY",
    note?: string,
    totalAmount: number,
}