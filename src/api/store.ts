// Lab2新增
// 开发时请解除3-4行的注释
import {axios} from '../utils/request'
import {STORE_MODULE} from './_prefix'
import {ref} from "vue";

export type StoreInfo = {
    storeName: string,
    category: string,
    imageUrl: string
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
    return axios.get(`${STORE_MODULE}/getStore/${storeId}`, storeId)
        .then(res => {
            return res.data.result
        })
}