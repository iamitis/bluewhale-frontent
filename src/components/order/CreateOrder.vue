<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {createOrder} from "../../api/order.ts";
import {ElMessage} from "element-plus";
import {router} from "../../router";

const props = defineProps({
  productId: Number,
  productName: String,
  productSales: Number,
  productPrice: Number,
  productStoreId: Number,
})
const userId = Number(sessionStorage.getItem('userId'))
const count = ref(1)
const totalPrice = computed(() => props.productPrice * count.value)
const pickup = ref('')
const address = ref('')
const consigneeName = ref('')
const consigneePhone = ref('')
const hasPickup = computed(() => pickup.value !== '')
const hasAddress = computed(() => address.value !== '')
const hasConsigneeName = computed(() => consigneeName.value !== '')
// 电话号码的规则
const chinaMobileRegex = /^1(3[0-9]|4[579]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[189])\d{8}$/
const phoneLegal = computed(() => chinaMobileRegex.test(consigneePhone.value))
const orderId = ref(-1)

function checkForm() {
  if (!hasPickup.value) {
    ElMessage.warning('请选择取货方式')
    return false
  } else if (pickup.value === 'DELIVERY' && !hasAddress.value) {
    ElMessage.warning('请填写收货地址')
    return false
  } else if (!hasConsigneeName.value) {
    ElMessage.warning('请填写收件人姓名')
  } else if (!phoneLegal.value) {
    ElMessage.warning('请填写正确的收件人电话号码')
  } else {
    handleCreate()
  }
}

function handleCreate() {
  createOrder({
    invoiceProductId: props.productId,
    invoiceProductNum: count.value,
    invoicePrice: totalPrice.value,
    invoiceStoreId: props.productStoreId,
    invoiceUserId: userId,
    getProducts: pickup.value,
    invoiceAddress: address.value,
    invoiceName: consigneeName.value,
    invoicePhone: consigneePhone.value,
  }).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        message: "下单成功！",
        type: 'success',
        center: true,
      })
      orderId.value = res.data.result
      ElMessageBox.confirm(
          '现在去支付？',
          {
            confirmButtonText: '去支付',
            cancelButtonText: '稍后支付',
            center: true,
          }
      ).then(() => {
        router.push(`/orderdetail/${orderId.value}`)
      }).catch(() => {
        window.location.reload()
      })
    }
  })
}
</script>

<template>
  <el-form
      class="order-form"
      label-position="left">
    <el-form-item label="购买数量">
      <el-input-number
          v-model="count"
          :min="1"
          :max="props.productSales" />
    </el-form-item>
    <el-form-item label="取货方式">
        <el-radio v-model="pickup" label="DELIVERY" size="large">快递送达</el-radio>
        <el-radio v-model="pickup" label="PICKUP" size="large">到店自提</el-radio>
    </el-form-item>
    <el-form-item v-if="pickup === 'DELIVERY'" label="收货地址">
      <el-input v-model="address"></el-input>
    </el-form-item>
    <el-form-item label="收件人姓名">
      <el-input
          v-model="consigneeName"
          maxlength="15"
          show-word-limit
          clearable />
    </el-form-item>
    <el-form-item label="收货人电话">
      <el-input
          v-model="consigneePhone"
          clearable />
    </el-form-item>
    <span>总价 : ￥{{count*productPrice}}</span>
    <span class="create-button-box">
        <el-button
            class="create-button"
            @click="checkForm"
            color="lightpink">
          下单
        </el-button>
      </span>
  </el-form>
</template>

<style scoped>
.order-form {}
.create-button-box {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  justify-content: right;
}
.create-button {
  color: steelblue;
}
</style>