<script setup lang="ts">
const props = defineProps([
  'order'
])
</script>

<template>
  <router-link :to="'/orderdetail' + order.orderId" v-slot="{navigate}">
    <el-card
        class="order-card">
      <el-row>
        <el-col>
          <h1>{{ order.name }}</h1>
        </el-col>
        <el-col>
          <el-tag>{{ order.state }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <span>单价 : {{ order.productPrice }}</span>
        <span>数量 : {{ order.count }}</span>
        <span>总价 : {{ order.totalPrice }}</span>
      </el-row>
      <el-row>
        <p>下单时间 : {{ order.createTime }}</p>
      </el-row>
    </el-card>
  </router-link>
</template>

<style scoped>

</style>