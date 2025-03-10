export interface IPagination {
    page: number;
    pageSize: number;
    totalPages: number;
    total: number;
}

export interface IResponse {
    success: boolean;
    message: string | null;
}

export interface IResponseWithData<T> extends IResponse {
    data: T;
}
