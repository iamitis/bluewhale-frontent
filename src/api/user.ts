import {axios} from '../utils/request'
import {USER_MODULE} from './_prefix'
import {Md5} from "ts-md5";

const md5 = new Md5()

type LoginInfo = {
    phone: string,
    password: string
}

type RegisterInfo = {
    role: string,
    name: string,
    phone: string,
    password: string,
    address: string,
    storeId?: number,
}

type UpdateInfo = {
    name?: string,
    password?: string,
    address?: string,
}

// 如果有“Vue: This may be converted to an async function”警告，可以不管
// 用户登录
export const userLogin = (loginInfo: LoginInfo) => {
    loginInfo.password = md5.start().appendStr(loginInfo.password).end()
    return axios.post(`${USER_MODULE}/login`, null, {params: loginInfo})
        .then(res => {
            return res
        })
}

// 用户注册
export const userRegister = (registerInfo: RegisterInfo) => {
    registerInfo.password = md5.start().appendStr(registerInfo.password).end()
    return axios.post(`${USER_MODULE}/register`, registerInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

// 获取用户信息
export const userInfo = () => {
    return axios.get(`${USER_MODULE}`)
        .then(res => {
            return res
        })
}

// 更新用户信息
export const userInfoUpdate = (updateInfo: UpdateInfo) => {
    if (updateInfo.password != undefined) {
        updateInfo.password = md5.start().appendStr(updateInfo.password).end()
    }
    return axios.post(`${USER_MODULE}`, updateInfo, {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

export const getAllPhones = () => {
    const userId = Number(sessionStorage.getItem('userId'))
    return axios.get(`${USER_MODULE}/getAllPhones`, {params: {userId: userId}})
        .then((res) => {
            return res.data.result
        })
}

export const getAllAddresses = () => {
    const userId = Number(sessionStorage.getItem('userId'))
    return axios.get(`${USER_MODULE}/getAllAddresses`, {params: {userId: userId}})
        .then(res => {
            return res.data.result
        })
}

export const addPhone = (phone: string) => {
    const params = {
        phone: phone,
        userId: Number(sessionStorage.getItem('userId'))
    }
    return axios.get(`${USER_MODULE}/addPhone`, {params: params})
        .then(res => {
            console.log(res)
            return res
        })
}

export const addAddress = (address: string) => {
    const params = {
        address: address,
        userId: Number(sessionStorage.getItem('userId'))
    }
    return axios.get(`${USER_MODULE}/addAddress`, {params: params})
        .then(res => {
            return res
        })
}

export const updateAddress = (address: string) => {
    const params = {
        address: address,
        userId: Number(sessionStorage.getItem('userId'))
    }
    return axios.get(`${USER_MODULE}/updateAddress`, {params: params})
        .then(res => {
            return res
        })
}
