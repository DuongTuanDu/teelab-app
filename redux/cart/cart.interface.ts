export interface ICart {
    productId: string,
    name: string,
    image: string,
    size: string,
    color?: string,
    price: number,
    quantity: number,
}

export interface ICartState {
    carts: ICart[],
    totalAmount: number
}