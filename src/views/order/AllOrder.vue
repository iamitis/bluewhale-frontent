<script setup lang="ts">
import {computed, ref} from "vue";
import OrderItem from "../../components/order/OrderItem.vue";
import {router} from "../../router";
import {ShoppingTrolley} from "@element-plus/icons-vue"
import {exportOrders, getAllOrderByUserId} from "../../api/order.ts";

const userId = Number(sessionStorage.getItem('userId'))
const role = sessionStorage.getItem('role')
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
const chosenList = ref([])
const orderSheet = ref([])
const activeIndex = ref('2')

getOrderList()

function handleSelectType(key: string, keyPath: string[]) {
  switch (key) {
    case '1':
      chosenList.value = orderList.value;
      break
    case '2':
      chosenList.value = unpaidOrderList.value;
      break;
    case '3':
      chosenList.value = unsendOrderList.value;
      break;
    case '4':
      chosenList.value = ungetOrderList.value;
      break;
    case '5':
      chosenList.value = uncommentOrderList.value;
      break;
    case '6':
      chosenList.value = doneOrderList.value;
      break;
    default:
      ElMessage.warning('错误！');
      break;
  }
}

function getOrderList() {
  getAllOrderByUserId(userId).then(res => {
    orderList.value = res
    chosenList.value = orderList.value.filter((order) => order.invoiceStatus === 'UNPAID')
  })
}

function downloadOrderSheet() {
  exportOrders().then((res: any) => {
    orderSheet.value = res
    window.open(orderSheet.value)
  })
}
</script>

<template>
  <el-container style="background: floralwhite">
    <el-header height="7%" class="page-top">
      <el-button
          v-if="role === 'CEO' || role === 'STAFF'"
          @click="downloadOrderSheet"
          text
          style="height: 100%; color: skyblue">
        下载报表
      </el-button>
      <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          @select="handleSelectType"
          :ellipsis="false"
          style="background: floralwhite"
          text-color="skyblue"
          active-text-color="skyblue">
        <el-menu-item index="1">所有订单</el-menu-item>
        <el-menu-item index="2">待支付</el-menu-item>
        <el-menu-item index="3">待发货</el-menu-item>
        <el-menu-item index="4">待收货</el-menu-item>
        <el-menu-item index="5">待评价</el-menu-item>
        <el-menu-item index="6">已完成</el-menu-item>
      </el-menu>
    </el-header>
    <el-main class="el-main">
      <el-empty
          v-if="chosenList.length === 0"
          description="什么也没有/_ \">
        <el-button
            v-if="role === 'CUSTOMER'"
            text
            :type="'primary'"
            class="empty-button"
            @click="() => {router.push('allstore')}">
          > 去商店区转转
          <el-icon class="el-icon--right">
            <shopping-trolley/>
          </el-icon>
        </el-button>
      </el-empty>
      <order-item
          style="text-decoration: none"
          v-if="chosenList.length > 0"
          v-for="order in chosenList.sort((a, b) => b.invoiceId - a.invoiceId)"
          :order="order"
          class="order-item"/>
    </el-main>
  </el-container>
</template>

<style scoped>
.page-top {
  background: floralwhite;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  gap: 1em;
}

.el-main {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  background: floralwhite;
  align-content: center;
}

.order-item {
  width: 35%;
  margin-top: 2rem;
}
</style>