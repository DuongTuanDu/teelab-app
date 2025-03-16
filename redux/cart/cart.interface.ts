export interface ICart {
    productId: string,
    name: string,
    image: string,
    size: string,
    color?: string | null,
    price: number,
    quantity: number,
}

export interface ICartState {
    carts: ICart[],
    totalAmount: number
}