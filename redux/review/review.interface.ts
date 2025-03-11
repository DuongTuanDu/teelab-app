
export interface IReview {
    _id: string,
    rate: number,
    images: {
        url: string,
        publicId: string
    }[],
    comment: string,
    user?: {
        avatar: {
            url: string,
            publicId: string
        }
        name: string
    }
    createdAt: string
}

export interface IReviewState {
    averageRating: number,
    totalRate: number
}

export interface IRateDistribution {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
}