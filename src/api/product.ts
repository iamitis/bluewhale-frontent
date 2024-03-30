// Lab2新增
// 开发时请解除3-4行的注释
import {axios} from '../utils/request'
import {IMAGE_MODULE, PRODUCT_MODULE} from './_prefix'

export type ProductInfo = {
    productName: string,
    productCategory: string
    productStoreId: number
    productPrice: number
    productDescription: string
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

export const getProductImages = (productType: string, productId: number) => {
    return axios.get(`${IMAGE_MODULE}/imagesDownload`, {params: {param1: productType, param2: productId}})
        .then(res => {
            return res.data.result
        })
}


export const updateProductSales = (productId: number, productSales: number) => {
    return axios.post(`${PRODUCT_MODULE}/updateProductSales`, {param1: productId, param2: productSales},
        {headers: {'Content-Type': "application/json"}})
        .then(res => {
            return res.data.result
        })
}











