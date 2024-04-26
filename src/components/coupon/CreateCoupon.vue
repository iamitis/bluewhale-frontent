<script setup lang="ts">
import {computed, ref} from "vue";
import {createCoupon} from "../../api/coupon.ts";
import {ElMessage} from "element-plus";

const emit = defineEmits(['createCouponFinished'])
const role = sessionStorage.getItem('role')
const userId = Number(sessionStorage.getItem('userId'))
const storeId = Number(sessionStorage.getItem('storeId'))
const couponCategory = ref('') // 蓝鲸券或满减券
const couponSpace = computed(() => {
  return role === 'CEO' ? 'GlobalCoupon' : 'StoreOnly'
}) // 全场券或商店券
const full = ref<Number>() // 满减券门槛
const reduction = ref<Number>() // 满减券减额
const expireTime = ref<Date>() // 过期时间
const couponNum = ref<Number>() // 发布数量
const hasType = computed(() => couponCategory.value != '')
const hasReduction = computed(() => reduction.value > 0)
const hasNum = computed(() => couponNum.value > 0)
const hasDate = computed(() => expireTime.value != ref<Date>().value)
const createAllowed = computed(() => {
  return hasType.value &&
      !(couponCategory.value === 'FullReduction' && !hasReduction.value) &&
      hasNum.value &&
      hasDate.value
})

function handleCreate() {
  createCoupon({
    userId: userId,
    couponStoreId: storeId,
    couponCategory: couponCategory.value,
    couponSpace: couponSpace.value,
    full: full.value,
    reduction: reduction.value,
    expireTime: expireTime.value,
    couponNum: couponNum.value,
  }).then((res) => {
    if (res.data.code === '000') {
      ElMessage({
        message: "发布优惠券组成功！",
        type: 'success',
        center: true,
      })
      emit("createCouponFinished", true)
    } else if (res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
      emit("createCouponFinished", false)
    }
  })
}
</script>

<template>
  <el-form>
    <el-form-item label="优惠券类型">
      <el-radio v-model="couponCategory" label="FullReduction" size="large">
        满减券
      </el-radio>
      <el-radio v-model="couponCategory" label="SpecialCoupon" size="large">
        蓝鲸券
      </el-radio>
    </el-form-item>
    <el-form-item v-if="couponCategory === 'FullReduction'" label="使用门槛">
      <el-input-number
          v-model="full"
          :precision="2"
          :min="0"
          :step="10"/>
    </el-form-item>
    <el-form-item v-if="couponCategory === 'FullReduction'" label="减免额度">
      <el-input-number
          v-model="reduction"
          :precision="2"
          :min="0"
          :step="10"/>
    </el-form-item>
    <el-form-item label="过期时间">
      <el-date-picker
          v-model="expireTime"
          type="date"
          placeholder="优惠券将在选定的日期后失效"/>
    </el-form-item>
    <el-form-item label="优惠券数量">
      <el-input-number v-model="couponNum" id="num"/>
    </el-form-item>
  </el-form>
  <span class="create-button-box">
        <el-button
            class="create-button"
            @click="handleCreate"
            :disabled="!createAllowed"
            color="lightpink">
          发布
        </el-button>
      </span>
</template>

<style scoped>
.create-button-box {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  justify-content: right;
}
</style>