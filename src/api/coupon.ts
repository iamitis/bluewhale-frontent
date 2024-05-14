import {axios} from '../utils/request'
import {COUPON_MODULE, USER_MODULE} from './_prefix'

export type CouponCreateInfo = {
    userId: number,
    couponStoreId: number,
    couponCategory: string,
    couponSpace: string,
    full: number,
    reduction: number,
    expireTime: Date,
    couponNum: number,
}

export const createCoupon = (couponCreateInfo: CouponCreateInfo) => {
    return axios.post(`${COUPON_MODULE}/createCouponGroup`,
        fillCouponVO(couponCreateInfo),
        {params: {'userId': couponCreateInfo.userId, 'num': couponCreateInfo.couponNum}})
        .then((res) => {
            return res
        })
}

export const getAllCoupon = () => {
    const userId = Number(sessionStorage.getItem('userId'))
    return axios.get(`${COUPON_MODULE}/getAllCouponGroups`, {params: {userId: userId}})
        .then(res => {
            return res.data.result
        })
}

export const receiveCoupon = (couponGroupId: number) => {
    const userId = Number(sessionStorage.getItem('userId'))
    return axios.post(`${COUPON_MODULE}/receiveCoupon`, null, {params: {couponGroupId: couponGroupId, userId: userId}})
        .then(res => {
            return res
        })
}

export const getReceivedCoupon = () => {
    const userId = Number(sessionStorage.getItem('userId'))
    return axios.get(`${USER_MODULE}/getAllCoupons`, {params: {userId: userId}})
        .then(res => {
            return res.data.result
        })
}

const fillCouponVO = (couponCreatInfo: CouponCreateInfo) => {
    return {
        couponStoreId: couponCreatInfo.couponStoreId,
        couponCategory: couponCreatInfo.couponCategory,
        couponSpace: couponCreatInfo.couponSpace,
        full: couponCreatInfo.full,
        reduction: couponCreatInfo.reduction,
        couponExpireTime: couponCreatInfo.expireTime,
    }
}

export function getCouponNote(coupon: any) {
    let category: string = coupon.couponCategory == null ? coupon.couponGroupCategory : coupon.couponCategory
    if (category === 'FullReduction') {
        const full: string = coupon.full
        const reduction: string = coupon.reduction
        return '满' + full + '元减' + reduction + '元'
    } else {
        return '0-100元区间打九五折；' +
            '100-200元区间打九折；' +
            '200-300元区间打八五折；' +
            '300-400元区间打八折；' +
            '400-500元区间打七五折；' +
            '500元以上区间打七折。'
    }
}

export function couponCategoryMap(category: string) {
    if (category === 'FullReduction') {
        return '满减券'
    } else if (category === 'SpecialCoupon') {
        return '蓝鲸券'
    } else {
        return 'error'
    }
}

export function timeMap(couponExpiredTime: string) {
    return couponExpiredTime.slice(5, 10)
}

export function couponStateMap(couponState: string) {
    if (couponState === 'UNUSED') {
        return {text: '未使用', type: ''}
    } else if (couponState === 'USED') {
        return {text: '已使用', type: 'info'}
    } else {
        return {text: 'error', type: 'danger'}
    }
}

export function coupon2CouponGroup(coupon: any) {
    return {
        couponGroupId: coupon.couponGroupId,
        couponGroupCategory: coupon.couponCategory,
        couponGroupSpace: coupon.couponSpace,
        couponGroupStoreId: coupon.couponStoreId,
        full: coupon.full,
        reduction: coupon.reduction,
        expiredTime: coupon.couponExpireTime,
        state: coupon.couponStatus,
    }
}