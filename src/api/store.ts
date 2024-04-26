import {axios} from '../utils/request'
import {STORE_MODULE} from './_prefix'

export type StoreInfo = {
    storeName: string,
    storeDescription: string,
    storeAddress: string,
    storeImageUrl: string,
}

export const createStore = (storeInfo: StoreInfo) => {
    return axios.post(`${STORE_MODULE}/createStore`, storeInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

export const allStoresInfo = () => {
    return axios.get(`${STORE_MODULE}/getAllStores`)
        .then(res => {
            return res.data.result
        })
}

export const storeInfo = (storeId: number) => {
    return axios.get(`${STORE_MODULE}/getStore/${storeId}`)
        .then(res => {
            return res.data.result
        })
}

export const allProductsInfo = (storeId: number) => {
    return axios.get(`${STORE_MODULE}/getAllProducts/${storeId}`)
        .then(res => {
                return res.data.result
            }
        )
}