// 未用
import axios from "axios";
import {API_MODULE} from "./_prefix.ts";

export type AlipayInfo = {
    out_trade_no: string,
    total_amout: number,
    subject: string,
}

export const notify = (alipayInfo: AlipayInfo) => {
    return axios.post(`${API_MODULE}/notify`, alipayInfo)
        .then(res => {
            return res
        })
}