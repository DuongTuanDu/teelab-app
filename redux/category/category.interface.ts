export interface ICategory {
    _id: number;
    name: string;
    slug: string
}

export interface ICategoryState {
    categories: ICategory[]
}