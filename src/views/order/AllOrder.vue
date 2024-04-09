<script setup lang="ts">
import {ref} from "vue";
import OrderItem from "../../components/OrderItem.vue";
import {router} from "../../router";
import {ShoppingTrolley} from "@element-plus/icons-vue"   //图标

const orderList = ref([])

function getOrderList() {
  // todo
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
          @click="() => {router.push('allstore')}">
        > 去商店区转转
        <el-icon class="el-icon--right"><shopping-trolley /></el-icon>
      </el-button>
    </el-empty>
    <order-item v-else v-for="order in orderList" />
  </el-main>
</template>

<style scoped>
.el-main {
  display: flex;
  display: -webkit-flex;
  flex-flow: column;
  justify-content: center;
  background: floralwhite;
}
</style>