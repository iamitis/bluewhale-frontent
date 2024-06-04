import {axios} from '../utils/request'
import {PRODUCT_MODULE} from './_prefix'
import {productTypeEnum} from "./product.ts";

export type SearchInfo = {
    storeId: number,
    name: string, // product's name
    type: string,
    minPrice: number,
    maxPrice: number,
}
export const searchProduct = (searchIndo: SearchInfo) => {
    let productList = []
    const detailedTypes = getDetailedType(searchIndo.type)
    let promise = detailedTypes.map((t: string) => {
        searchIndo.type = t
        return axios.get(`${PRODUCT_MODULE}/searchProduct`, {params: searchIndo})
            .then((res) => {
                productList.push(...res.data.result)
                return res.data.result
            })
    })
    return Promise.all(promise).then(() => {
        return productList
    })
}

// 为了支持筛选一级分类，如选择‘食品’则同时列出‘饮料’、‘零食’和‘生鲜’，
// 若参数为一级分类，返回其子分类的数组
// e.g., 'FOOD' -> return ['FOOD_DRINKS', 'FOOD_SNACKS', 'FOOD_FRESH_FOOD']
function getDetailedType(type: string) {
    let isDetailedType: boolean = true;
    let detailedTypes: Array<string> = []
    for (let i: number = 0; i < productTypeEnum.length; ++i) {
        if (productTypeEnum[i].value === type) {
            // 说明为一级分类
            if (productTypeEnum[i].children != null) {
                isDetailedType = false;
                for (let j:number = 0; j < productTypeEnum[i].children.length; ++j) {
                    detailedTypes.push(productTypeEnum[i].children[j].value)
                }
            }
            break
        }
    }
    if (isDetailedType) { // 传进来的type已经是最细分类
        detailedTypes.push(type)
    }
    return detailedTypes
}