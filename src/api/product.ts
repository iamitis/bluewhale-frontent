// Lab2新增
// 开发时请解除3-4行的注释
import {axios} from '../utils/request'
import {IMAGE_MODULE, PRODUCT_MODULE} from './_prefix'

export type ProductInfo = {
    productStoreId: number
    productName: string,
    productDescription: string
    productPrice: number
    productRemains: number
    productSales: number
    productCategory: string
    productImageUrl: string
}

export type DetailImage = {
    productId: number
    picture: string
}

export type UpdateInfo = {
    product_id: number
    sales: number
}

export type DetailImageInfo = {
    imageBelong: string
    belongId: number
}

export const createProduct = (productInfo: ProductInfo) => {
    return axios.post(`${PRODUCT_MODULE}/createProduct`, productInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

export const productInfo = (productId: number) => {
    return axios.get(`${PRODUCT_MODULE}/getProduct/${productId}`)
        .then(res => {
            return res.data.result
        })
}

export const getProductImages = (detailImageInfo: DetailImageInfo) => {
    return axios.get(`${IMAGE_MODULE}/imagesDownload`, {params: detailImageInfo})
        .then(res => {
            return res.data.result
        })
}


export const updateProductSales = (updateInfo: UpdateInfo) => {
    return axios.put(`${PRODUCT_MODULE}/updateProductSales`, null,
        {params: updateInfo},
    )
        .then(res => {
            return res
        })
}

export const updateProductPicture = (detailImage: DetailImage) => {
    return axios.post(`${PRODUCT_MODULE}/updateProductPicture`, null,
        {params: detailImage})
        .then(res => {
            return res.data.result
        })
}

export const getAllRates = (productId: number) => {
    return axios.get(`${PRODUCT_MODULE}/getAllComments/${productId}`)
        .then(res => {
            return res.data.result
        })
}

export const productTypeEnum: Array = [
    {
        value: 'FOOD',
        label: '食品',
        children: [
            {
                value: 'FOOD_DRINKS',
                label: '饮料'
            },
            {
                value: 'FOOD_SNACKS',
                label: '零食'
            },
            {
                value: 'FOOD_FRESH_FOOD',
                label: '生鲜'
            }
        ]
    },
    {
        value: 'CLOTHES',
        label: '服装',
        children: [
            {
                value: 'CLOTHES_MEN',
                label: '男装'
            },
            {
                value: 'CLOTHES_WOMEN',
                label: '女装'
            },
            {
                value: 'CLOTHES_KIDS',
                label: '童装'
            }
        ]
    },
    {
        value: 'FURNITURE',
        label: '家具',
        children: [
            {
                value: 'FURNITURE_BATHS',
                label: '卫浴'
            },
            {
                value: 'FURNITURE_LIGHTS',
                label: '照明'
            }
        ]
    },
    {
        value: 'ENTERTAINMENT',
        label: '娱乐',
        children: [
            {
                value: 'ENTERTAINMENT_TOYS',
                label: '玩具',
            },
            {
                value: 'ENTERTAINMENT_BOOKS',
                label: '书籍',
            },
            {
                value: 'ENTERTAINMENT_MUSIC',
                label: '乐器',
            }
        ]
    },
    {
        value: 'SPORTS',
        label: '运动',
        children: [
            {
                value: 'SPORTS_BALLS',
                label: '球类'
            },
            {
                value: 'SPORTS_RUNNING',
                label: '跑步'
            }
        ]
    },
    {
        value: 'LUXURY',
        label: '奢品',
        children: [
            {
                value: 'LUXURY_JEWELRY',
                label: '珠宝'
            },
            {
                value: 'LUXURY_WATCH',
                label: '腕表'
            }
        ]
    },
    {
        value: 'ELECTRONICS',
        label: '数码'
    }
]