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

export interface IPriceRange {
    min: number;
    max: number;
}

export interface IFilterCategory {
    _id: string;
    name: string;
    slug: string;
    productCount: number;
}

export interface IRatingFilter {
    value: number;
    label: string;
}

export interface IProductFilterData {
    priceRanges: IPriceRange[];
    categories: IFilterCategory[];
    ratings: IRatingFilter[];
    colors: string[];
}

export interface ICategoryProductResponse {
    category: {
        _id: string;
        name: string;
        slug: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
    products: IProduct[];
}

export interface IProductListResponse {
    products: IProduct[];
    pagination: {
        page: number;
        pageSize: number;
        totalPage: number;
        totalItems: number;
    };
}