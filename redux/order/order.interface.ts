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