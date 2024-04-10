<script setup lang="ts">
import {computed, ref} from "vue";
import OrderItem from "../../components/OrderItem.vue";
import {router} from "../../router";
import {ShoppingTrolley} from "@element-plus/icons-vue"
import {getAllOrderByUserId} from "../../api/order.ts";   //图标

const userId = Number(sessionStorage.getItem('userId'))
const orderType = ref('ALL')
const orderList = ref([])
const unpaidOrderList = computed(() => {
  return orderList.value.filter((order) => order.invoiceStatus === 'UNPAID')
})
const unsendOrderList = computed(() => {
  return orderList.value.filter((order) => order.invoiceStatus === 'UNSEND')
})
const ungetOrderList = computed(() => {
  return orderList.value.filter((order) => order.invoiceStatus === 'UNGET')
})
const uncommentOrderList = computed(() => {
  return orderList.value.filter((order) => order.invoiceStatus === 'UNCOMMENT')
})
const doneOrderList = computed(() => {
  return orderList.value.filter((order) => order.invoiceStatus === 'DONE')
})

getOrderList()
function getOrderList() {
  getAllOrderByUserId(userId).then(res => {
    orderList.value = res
  })
}
</script>

<template>
  <el-main class="el-main">
    <el-empty
        v-if="orderList.length === 0"
        description="空空如也/_ \">
      <el-button
          text
          type="primary"
          class="empty-button"
          @click="() => {router.replace('allstore')}">
        > 去商店区转转
        <el-icon class="el-icon--right"><shopping-trolley /></el-icon>
      </el-button>
    </el-empty>
    <span>
    <el-button
        v-model="orderType"
        @click="orderType = 'ALL'">
      所有订单
    </el-button>
    <el-button
        v-model="orderType"
        @click="orderType = 'UNPAID'">
      待支付
    </el-button>
    <el-button
        v-model="orderType"
        @click="orderType = 'UPSEND'">
      待发货
    </el-button>
    <el-button
        v-model="orderType"
        @click="orderType = 'UNGET'">
      待收货
    </el-button>
    <el-button
        v-model="orderType"
        @click="orderType = 'UNCOMMENT'">
      待评价
    </el-button>
    <el-button
        v-model="orderType"
        @click="orderType = 'DONE'">
      已完成
    </el-button>
      </span>
    <order-item
        v-if="orderList.length > 0 && orderType === 'ALL'"
        v-for="order in orderList"
        :order="order"
        class="order-item"/>
    <order-item
        v-if="orderList.length > 0 && orderType === 'UNPAID'"
        v-for="order in unpaidOrderList"
        :order="order"
        class="order-item"/>
    <order-item
        v-if="orderList.length > 0 && orderType === 'UNSEND'"
        v-for="order in unsendOrderList"
        :order="order"
        class="order-item"/>
    <order-item
        v-if="orderList.length > 0 && orderType === 'UNGET'"
        v-for="order in ungetOrderList"
        :order="order"
        class="order-item"/>
    <order-item
        v-if="orderList.length > 0 && orderType === 'UNCOMMENT'"
        v-for="order in uncommentOrderList"
        :order="order"
        class="order-item"/>
    <order-item
        v-if="orderList.length > 0 && orderType === 'DONE'"
        v-for="order in doneOrderList"
        :order="order"
        class="order-item"/>
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
  gap: 20px;
}

.order-item {
  width: 60%;
}
</style>