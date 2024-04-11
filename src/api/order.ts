import {axios} from '../utils/request'
import {ORDER_MODULE, USER_MODULE} from './_prefix'
import {install} from "element-plus";

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

export type OrderPayInfo = {
    invoiceId: number,
    invoicePrice: number,
}

export type OrderRateInfo = {
    invoiceId: number,
    score: number,
    comment: string,
}

export const getAllOrderByUserId = (userId: number) => {
    return axios.get(`${USER_MODULE}/getAllInvoices`, {params: {'userId': userId}})
        .then(res => {
            return res.data.result
        })
}

export const getOrderByOrderId = (invoiceId: number) => {
    return axios.get(`${ORDER_MODULE}/getInvoice/${invoiceId}`)
        .then(res => {
            return res.data.result
        })
}

export const createOrder = (orderCreateInfo: OrderCreateInfo) => {
    return axios.post(`${ORDER_MODULE}/createInvoice`, orderCreateInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

export const payOrder = (orderPayInfo: OrderPayInfo) => {
    return axios.post(`${ORDER_MODULE}/payInvoice`, null, {params: orderPayInfo})
        .then(res => {
            return res
        })
}

export const shipOrder = (invoiceId: number) => {
    return axios.post(`${ORDER_MODULE}/sendInvoice`, null, {params: invoiceId})
        .then(res => {
            return res
        })
}

export const receiveOrder = (invoiceId: number) => {
    return axios.post(`${ORDER_MODULE}/getInvoice`, null, {params: invoiceId})
        .then(res => {
            return res
        })
}

export const rateOrder = (orderRateInfo: OrderRateInfo) => {
    console.log(orderRateInfo)
    return axios.post(`${ORDER_MODULE}/commentInvoice`, null, {params: orderRateInfo})
        .then(res => {
            return res
        })
}

export const formattedTime = (timestamp) => {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDay()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const stateMap = new Map()
stateMap.set('UNPAID', {text: '待支付', type: 'danger'})
stateMap.set('UNSEND', {text: '待发货', type: 'primary'})
stateMap.set('UNGET', {text: '待收货', type: 'primary'})
stateMap.set('UNCOMMENT', {text: '待评价', type: 'success'})
stateMap.set('DONE', {text: '已完成', type: 'info'})