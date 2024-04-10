import {axios} from '../utils/request'
import {ORDER_MODULE, USER_MODULE} from './_prefix'

export type OrderCreateInfo = {
    invoiceProductId: number,
    invoiceProductNum: number, // product's count
    invoiceUserId: number,
    invoiceStoreId: number,
    invoicePrice: number, // total voice
    invoiceAddress: string, // consignee's address
    invoiceName: string, // consignee's name
    invoicePhone: string, // consignee's phone
    getProducts: string, // way of pickup
}

export const getAllOrderByUserId = (userId: number) => {

}

export const getOrderByOrderId = 0

export const createOrder = (orderCreateInfo: OrderCreateInfo) => {
    return axios.post(`${ORDER_MODULE}/createInvoice`, orderCreateInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}