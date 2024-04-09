<script setup lang="ts">
import {ref} from "vue";

const order = ref()
function getOrder() {
  // todo
}

function handlePay() {
  // todo
}
</script>

<template>
  <el-card class="order-card">
    <el-row>
      <el-col>
        <el-image :src="order.productCoverUrl" />
      </el-col>
      <el-col>
        <h2>{{order.productName}}</h2>
        <p>单价 : ￥{{order.productPrice}}</p>
        <p>数量 : {{order.count}}</p>
        <p>总价 : {{order.totalPrice}}</p>
        <p v-if="order.state !== 'UNPAID'">实付款 : {{order.payment}}</p>
      </el-col>
    </el-row>
    <el-row v-if="order.pickup === 'DELIVERY'">
      <p>送货地址 : {{order.sendAddress}}</p>
    </el-row>
    <el-row>
      <p>订单编号 : {{order.id}}</p>
      <p>订单创建时间 : {{order.createTime}}</p>
      <p v-if="order.state !== 'UNPAID'">付款时间 : {{order.payTime}}</p>
      <p v-if="order.state !== 'UNPAID' && order.state !== 'UNSEND'">发货时间 : {{order.sendTime}}</p>
    </el-row>
    <el-row>
      <el-col>
        <h2>订单状态 : </h2>
        <span>
          <el-tag>{{order.state}}</el-tag>
        </span>
      </el-col>
      <el-col>
        <el-button
            v-if="order.state === 'UNPAID'"
            @click="handlePay">
          去支付
        </el-button>
      </el-col>
      <el-col>
        <el-button
            v-if="order.state === 'UNCOMMENT'"
            text>
          评价一下
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped>

</style>