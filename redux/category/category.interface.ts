export interface ICategory {
    _id: number;
    name: string;
    slug: string;
    priceRange?: number[];
    categories?: string[];
    rating?: string;
    colors?: string[];
    page?: number;
    pageSize?: number;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export interface ICategoryState {
    categories: ICategory[]
}