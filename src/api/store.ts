// Lab2新增
// 开发时请解除3-4行的注释
import {axios} from '../utils/request'
import {STORE_MODULE, USER_MODULE} from './_prefix'

type StoreInfo = {
    storeName: string,
    category: string
}

export const createStore = (storeInfo: StoreInfo) => {
    return axios.post(`${STORE_MODULE}/createStore`, storeInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

export const allStoreInfo = () => {
    return axios.get(`${STORE_MODULE}/getAllStores`)
        .then(res => {
            return res.data
        })
}