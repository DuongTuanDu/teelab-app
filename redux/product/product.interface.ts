import { ICategory } from "../category/category.interface";

export interface IProduct {
    _id: string;
    name: string;
    price: number;
    mainImage: {
        url: string,
        publicId: string
    };
    variants: {
        color: string,
        image: {
            url: string,
            publicId: string
        }
    }[],
    slug: string,
    averageRating: number,
    totalReviews: number,
    description: string,
    isPromotion: boolean,
    category: ICategory,
    promotion: {
        finalPrice: number,
        promotionInfo: {
            id: string,
            name: string,
            type: string,
            value: number,
            banner: {
                url: string,
                publicId: string
            },
        },
    } | null
}