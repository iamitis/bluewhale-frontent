<script setup lang="ts">
import {computed, ref} from "vue";
import {router} from "../../router";
import {Close} from "@element-plus/icons-vue"
import {formattedTime, getOrderByOrderId, payOrder, stateMap} from "../../api/order.ts";
import {productInfo} from "../../api/product.ts";
import PayOrder from "../../components/order/PayOrder.vue";
import ShipOrder from "../../components/order/ShipOrder.vue";
import ReceiveOrder from "../../components/order/ReceiveOrder.vue";
import RateOrder from "../../components/order/RateOrder.vue";
import CancelOrder from "../../components/order/CancelOrder.vue";
import {parseTime} from "../../utils";

const orderId = ref(-1)
const order = ref()
const count = ref(-1)
const totalPrice = ref(-1)
const payment = ref(-1)
const address = ref('')
const consigneeName = ref('')
const consigneePhone = ref('')
const pickup = ref('')
const orderState = ref('')
const printState = ref('')
const stateTagType = computed(() => {
  return printState.value.type
})
const stateTagText = computed(() => {
  return printState.value.text
})
const storeId = ref(-1)
const productId = ref(-1)
const productCoverUrl = ref('')
const productName = ref('')
const productPrice = ref('') // unit price
const orderCreateTime = ref('')
const orderPayTime = ref('')
const payDialogVisible = ref(false)
const shipDialogVisible = ref(false)
const receiveDialogVisible = ref(false)
const rateDialogVisible = ref(false)
const cancelDialogVisible = ref(false)
const role = sessionStorage.getItem('role')

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
    consigneeName.value = res.invoiceName
    consigneePhone.value = res.invoicePhone
    pickup.value = res.getProducts
    orderState.value = res.invoiceStatus
    printState.value = stateMap.get(res.invoiceStatus)
    orderCreateTime.value = parseTime(res.invoiceTime)
    orderPayTime.value = res.invoicePayTime == null ? '' : parseTime(res.invoicePayTime)
    storeId.value = res.invoiceStoreId
    productId.value = res.invoiceProductId
    return productInfo(res.invoiceProductId)
  }).then(res => {
    productCoverUrl.value = res.productImageUrl
    productName.value = res.productName
    productPrice.value = res.productPrice
  })
}

function closeDialog() {
  payDialogVisible.value = false
  shipDialogVisible.value = false
  receiveDialogVisible.value = false
  rateDialogVisible.value = false
  cancelDialogVisible.value = false
}

function refresh(success: boolean) {
  if (success) {
    closeDialog()
    getOrder()
  }
}
</script>

<template>
  <el-main class="el-main">
    <el-card class="order-card" shadow="never">
      <el-row justify="space-between">
        <el-col :span="6">
          <el-tag :type="stateTagType" class="order-state">{{ stateTagText }}</el-tag>
        </el-col>
        <el-col v-if="orderState === 'UNPAID' && role === 'CUSTOMER'" :span="1" style="margin-top: -5px">
          <el-button
              type="info"
              :icon="Close"
              circle
              @click="cancelDialogVisible = true" />
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="10">
          <h1>{{ productName }}</h1>
          <el-text size="large" type="info" tag="p">&emsp;&emsp;&emsp;&emsp;数量 :
            <el-tag color="floralwhite">{{ count }}</el-tag>
          </el-text>
          <el-text size="large" type="info" tag="p">&emsp;&emsp;&emsp;&emsp;单价 :
            <el-tag color="floralwhite">￥{{ productPrice }}</el-tag>
          </el-text>
          <el-text size="large" type="info" tag="p">&emsp;&emsp;&emsp;&emsp;总价 :
            <el-tag color="floralwhite">￥{{ totalPrice }}</el-tag>
          </el-text>
          <el-text size="large" type="info" tag="p" v-if="orderState !== 'UNPAID'">&emsp;&emsp;&emsp;&emsp;实付 :
            <el-tag color="floralwhite">￥{{ payment }}</el-tag>
          </el-text>
          <el-text size="large" type="info" tag="p" v-if="pickup === 'DELIVERY'">&emsp;&emsp;收货地址 :
            <el-tag color="floralwhite">{{ address }}</el-tag>
          </el-text>
          <el-text size="large" type="info" tag="p">&emsp;取件人姓名 :
            <el-tag color="floralwhite">{{ consigneeName }}</el-tag>
          </el-text>
          <el-text size="large" type="info" tag="p">&emsp;取件人电话 :
            <el-tag color="floralwhite">{{ consigneePhone }}</el-tag>
          </el-text>
        </el-col>
        <el-col :span="8">
          <el-image
              :src="productCoverUrl"
              @click="router.push(`/storedetail/${storeId}/productdetail/${productId}`)"/>
        </el-col>
      </el-row>
      <el-row justify="space-between" align="bottom">
        <el-col :span="20">
          <el-text size="large" type="info" tag="p">&emsp;&emsp;订单编号 :
            <el-tag color="floralwhite">{{ orderId }}</el-tag>
          </el-text>
          <el-text size="large" type="info" tag="p">订单创建时间 :
            <el-tag color="floralwhite">{{ orderCreateTime }}</el-tag>
          </el-text>
          <el-text size="large" type="info" tag="p" v-if="orderState !== 'UNPAID'">订单付款时间 :
            <el-tag color="floralwhite">{{ orderPayTime }}</el-tag>
          </el-text>
        </el-col>
        <el-col v-if="orderState === 'UNPAID' && role === 'CUSTOMER'" :span="2">
          <el-button
              class="go-pay-button"
              color="lightpink"
              @click="payDialogVisible = true">
            去支付
          </el-button>
        </el-col>
        <el-col v-if="orderState === 'UNGET' && role === 'CUSTOMER'" :span="2">
          <el-button
              class="go-receive-button"
              color="deepskyblue"
              style="color: white"
              @click="receiveDialogVisible = true">
            确认收货
          </el-button>
        </el-col>
        <el-col v-if="orderState === 'UNCOMMENT' && role === 'CUSTOMER'" :span="2">
          <el-button
              type="success"
              @click="rateDialogVisible = true"
              text>
            评价一下
          </el-button>
        </el-col>
        <el-col v-if="orderState === 'UNSEND' && role === 'STAFF'" :span="2">
          <el-button
              color="lightpink"
              style="color: white"
              @click="shipDialogVisible = true">
            去发货
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
        class="pay-dialog"
        v-model="payDialogVisible"
        style="width: min-content"
        draggable>
      <template #header>
        <el-text tag="h1" size="large">为 <el-tag type="info">{{productName}}</el-tag> 支付</el-text>
      </template>
      <pay-order :order-id="orderId" :total-price="totalPrice" @pay-finished="refresh"/>
    </el-dialog>
    <el-dialog
        class="ship-dialog"
        v-model="shipDialogVisible"
        width="20%"
        draggable>
      <template #header>
        <el-text tag="h1" size="large">为 <el-tag type="info">{{productName}}</el-tag> 发货</el-text>
      </template>
      <ship-order :order-id="orderId" :count="count" @ship-finished="refresh"/>
    </el-dialog>
    <el-dialog
        class="receive-dialog"
        v-model="receiveDialogVisible"
        width="20%"
        draggable>
      <template #header>
        <el-text tag="h1" size="large">确认您购买的商品 <el-tag type="info">{{productName}}</el-tag> 已收到</el-text>
      </template>
      <receive-order :order-id="orderId" :count="count" @receive-finished="refresh"/>
    </el-dialog>
    <el-dialog
        class="rate-dialog"
        v-model="rateDialogVisible"
        width="30%"
        draggable
        title="请给我们一个好评!">
      <rate-order :order-id="orderId" @rate-finished="refresh"/>
    </el-dialog>
    <el-dialog
        class="cancel-dialog"
        v-model="cancelDialogVisible"
        width="30%"
        draggable>
      <template #header>
        <el-text tag="h1" size="large">确定取消 <el-tag type="info">{{productName}}</el-tag> 的订单吗</el-text>
      </template>
      <cancel-order :order-id="orderId"/>
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
  height: min-content;
  background: aliceblue;
}

.order-state {
  width: 100px;
  height: 40px;
  font-size: 120%;
}

.go-pay-button {
  color: white;
  margin-top: 30px;
}
</style>