<script setup lang="ts">
import {computed, ref} from "vue";
import OrderItem from "../../components/order/OrderItem.vue";
import {router} from "../../router";
import {ShoppingTrolley} from "@element-plus/icons-vue"
import {getAllOrderByUserId} from "../../api/order.ts";

const userId = Number(sessionStorage.getItem('userId'))
const role = sessionStorage.getItem('role')
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
const chosenList = ref([])

getOrderList()

function getOrderList() {
  getAllOrderByUserId(userId).then(res => {
    orderList.value = res
    chosenList.value = res
  })
}
</script>

<template>
  <el-main class="el-main">
    <el-empty
        v-if="chosenList.length === 0"
        description="什么也没有/_ \">
      <el-button
          v-if="role === 'CUSTOMER'"
          text
          type="primary"
          class="empty-button"
          @click="() => {router.push('allstore')}">
        > 去商店区转转
        <el-icon class="el-icon--right">
          <shopping-trolley/>
        </el-icon>
      </el-button>
    </el-empty>
    <div v-if="orderList.length > 0" class="choose-button">
      <el-button
          v-model="orderType"
          color="skyblue"
          plain
          @click="chosenList = orderList">
        所有订单
      </el-button>
      <el-button
          v-model="orderType"
          type="danger"
          plain
          @click="chosenList = unpaidOrderList">
        待支付
      </el-button>
      <el-button
          v-model="orderType"
          type="primary"
          plain
          @click="chosenList = unsendOrderList">
        待发货
      </el-button>
      <el-button
          v-model="orderType"
          type="primary"
          plain
          @click="chosenList = ungetOrderList">
        待收货
      </el-button>
      <el-button
          v-model="orderType"
          type="success"
          plain
          @click="chosenList = uncommentOrderList">
        待评价
      </el-button>
      <el-button
          v-model="orderType"
          type="info"
          plain
          @click="chosenList = doneOrderList">
        已完成
      </el-button>
    </div>
    <order-item
        style="text-decoration: none"
        v-if="chosenList.length > 0"
        v-for="order in chosenList.sort((a, b) => b.invoiceId - a.invoiceId)"
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

.choose-button {
  display: flex;
  display: -webkit-flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  gap: 50px;

  position: fixed;
  top: 270px;
  left: 80px
}

.order-item {
  width: 60%;
}
</style>