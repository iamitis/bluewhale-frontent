<script setup lang="ts">
import {ref} from "vue";
import OrderItem from "../../components/OrderItem.vue";
import {router} from "../../router";
import {ShoppingTrolley} from "@element-plus/icons-vue"
import {getAllOrderByUserId} from "../../api/order.ts";   //图标

const userId = Number(sessionStorage.getItem('userId'))
const orderList = ref([])

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
    <order-item
        v-else
        v-for="order in orderList"
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