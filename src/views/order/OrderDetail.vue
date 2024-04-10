<script setup lang="ts">
import {ref} from "vue";
import {router} from "../../router";
import {formattedTime, getOrderByOrderId, payOrder} from "../../api/order.ts";
import {productInfo} from "../../api/product.ts";
import PayOrder from "../../components/PayOrder.vue";
import ShipOrder from "../../components/ShipOrder.vue";

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
const productCoverUrl = ref('')
const productName = ref('')
const productPrice = ref('') // unit price
const orderCreateTime = ref('')
const orderPayTime = ref('')
const payDialogVisible = ref(false)
const shipDialogVisible = ref(false)
const receiveDialogVisible = ref(false)
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
          <el-text size="large" type="info" tag="p">&emsp;&emsp;&emsp;&emsp;数量 : <el-tag color="floralwhite">{{ count }}</el-tag></el-text>
          <el-text size="large" type="info" tag="p">&emsp;&emsp;&emsp;&emsp;单价 : <el-tag color="floralwhite">￥{{ productPrice }}</el-tag></el-text>
          <el-text size="large" type="info" tag="p">&emsp;&emsp;&emsp;&emsp;总价 : <el-tag color="floralwhite">￥{{ totalPrice }}</el-tag></el-text>
          <el-text size="large" type="info" tag="p" v-if="orderState !== 'UNPAID'">&emsp;&emsp;&emsp;&emsp;实付 : <el-tag color="floralwhite">￥{{ payment }}</el-tag></el-text>
          <el-text size="large" type="info" tag="p" v-if="pickup === 'DELIVERY'">&emsp;&emsp;送货地址 : <el-tag color="floralwhite">{{ address }}</el-tag></el-text>
          <el-text size="large" type="info" tag="p">&emsp;取件人姓名 : <el-tag color="floralwhite">{{consigneeName}}</el-tag></el-text>
          <el-text size="large" type="info" tag="p">&emsp;取件人电话 : <el-tag color="floralwhite">{{consigneePhone}}</el-tag></el-text>
        </el-col>
        <el-col :span="8">
          <el-image :src="productCoverUrl"/>
        </el-col>
      </el-row>
      <el-row justify="space-between" align="bottom">
        <el-col :span="20">
          <el-text size="large" type="info" tag="p">&emsp;&emsp;订单编号 : <el-tag color="floralwhite">{{ orderId }}</el-tag></el-text>
          <el-text size="large" type="info" tag="p">订单创建时间 : <el-tag color="floralwhite">{{ orderCreateTime }}</el-tag></el-text>
          <el-text size="large" type="info" tag="p" v-if="orderState !== 'UNPAID'">订单付款时间 : <el-tag color="floralwhite">{{ orderPayTime }}</el-tag></el-text>
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
        width="20%"
        draggable
        :title="'为 ' + productName + ' 支付'">
      <pay-order :order-id="orderId" :total-price="totalPrice" />
    </el-dialog>
    <el-dialog
        class="ship-dialog"
        v-model="shipDialogVisible"
        width="20%"
        draggable
        :title="'为 ' + productName + ' 发货'">
      <ship-order :order-id="orderId" :count="count" />
    </el-dialog>
    <el-dialog
        class="receive-dialog"
        v-model="receiveDialogVisible"
        width="20%"
        draggable
        :title="'确认您购买的商品 ' + productName + ' 已收到'">
      <receive-order :order-id="orderId" :count="count" />
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
  height: 48%;
  background: aliceblue;
}
.order-state {
  width: 100px;
  height: 50px;
  font-size: 120%;
}
.go-pay-button {
  color: white;
  margin-top: 30px;
}
</style>