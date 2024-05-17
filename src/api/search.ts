import {axios} from '../utils/request'
import {PRODUCT_MODULE} from './_prefix'

export type SearchInfo = {
    store_id: number,
    name: string, // product's name
    type: string,
    min_price: number,
    max_price: number,
}
export const searchProduct = (searchIndo: SearchInfo) => {
    return axios.get(`${PRODUCT_MODULE}/searchProduct`, {params: searchIndo})
        .then((res) => {
            return res.data.result
        })
}