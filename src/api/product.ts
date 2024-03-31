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
    productId: number
    productSales: number
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
    console.log(detailImageInfo)
    return axios.get(`${IMAGE_MODULE}/imagesDownload`, {params: detailImageInfo})
        .then(res => {
            return res.data.result
        })
}


export const updateProductSales = (updateInfo: UpdateInfo) => {
    console.log(updateInfo)
    return axios.post(`${PRODUCT_MODULE}/updateProductSales`, null,
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
            console.log(res.data.result)
            return res.data.result
        })
}