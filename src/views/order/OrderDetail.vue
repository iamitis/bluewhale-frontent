<script setup lang="ts">
import {ref} from "vue";
import {router} from "../../router";
import {formattedTime, getOrderByOrderId, payOrder} from "../../api/order.ts";
import {productInfo} from "../../api/product.ts";
import PayOrder from "../../components/PayOrder.vue";

const orderId = ref(-1)
const order = ref()
const count = ref(-1)
const totalPrice = ref(-1)
const payment = ref(-1)
const address = ref('')
const pickup = ref('')
const orderState = ref('')
const productCoverUrl = ref('')
const productName = ref('')
const productPrice = ref('') // unit price
const orderCreateTime = ref('')
const orderPayTime = ref('')
const payDialogVisible = ref(false)

getOrder()

async function getOrderId() {
  orderId.value = Number(router.currentRoute.value.params.orderId)
  return orderId.value
}

function getOrder() {
  getOrderId().then(res => {
    return getOrderByOrderId(res)
  }).then(res => {
    order.value = res
    count.value = res.invoiceProductNum
    totalPrice.value = res.invoicePrice
    payment.value = res.invoiceRealPrice
    address.value = res.invoiceAddress
    pickup.value = res.getProducts
    orderState.value = res.invoiceStatus
    orderCreateTime.value = formattedTime(Date.parse(res.invoiceTime))
    orderPayTime.value = formattedTime(Date.parse(res.invoicePayTime))
    return productInfo(res.invoiceProductId)
  }).then(res => {
    productCoverUrl.value = res.productImageUrl
    productName.value = res.productName
    productPrice.value = res.productPrice
  })
}
</script>

<template>
  <el-main class="el-main">
    <el-card class="order-card">
      <el-row>
        <el-col>
          <el-tag class="order-state">{{ orderState }}</el-tag>
        </el-col>
      </el-row>
      <el-row :justify="'space-between'">
        <el-col :span="6">
          <h1>{{ productName }}</h1>
          <el-text size="large" tag="p">单价 : ￥{{ productPrice }}</el-text>
          <el-text size="large" tag="p">数量 : {{ count }}</el-text>
          <el-text size="large" tag="p">总价 : ￥{{ totalPrice }}</el-text>
          <p v-if="orderState !== 'UNPAID'">实付款 : ￥{{ payment }}</p>
          <p v-if="pickup === 'DELIVERY'">送货地址 : {{ address }}</p>
        </el-col>
        <el-col :span="8">
          <el-image :src="productCoverUrl"/>
        </el-col>
      </el-row>
      <el-row justify="space-between" align="bottom">
        <el-col :span="20">
          <el-text size="large" tag="p">订单编号 : {{ orderId }}</el-text>
          <el-text size="large" tag="p">订单创建时间 : {{ orderCreateTime }}</el-text>
          <p v-if="orderState !== 'UNPAID'">付款时间 : {{ orderPayTime }}</p>
        </el-col>
        <el-col v-if="orderState === 'UNPAID'" :span="2">
          <el-button
              class="go-pay-button"
              color="lightpink"
              @click="payDialogVisible = true">
            去支付
          </el-button>
        </el-col>
        <el-col v-if="orderState === 'UNCOMMENT'" :span="2">
          <el-button
              type="success"
              text>
            评价一下
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
        class="pay-dialog"
        v-model="payDialogVisible"
        width="20%"
        draggable
        :title="'为 ' + productName + ' 支付'">
      <pay-order :order-id="orderId" :total-price="totalPrice" />
    </el-dialog>
  </el-main>
</template>

<style scoped>
.el-main {
  display: flex;
  display: -webkit-flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  background: floralwhite;
}
.order-card {
  width: 60%;
  height: 45%;
  background: aliceblue;
}
.order-state {
  width: 100px;
  height: 50px;
  font-size: 120%;
}
.go-pay-button {
  color: white;
}
</style>