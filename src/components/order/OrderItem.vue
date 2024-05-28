<script setup lang="ts">
import {computed, ref} from "vue";
import {productInfo} from "../../api/product.ts";
import {formattedTime, stateMap} from "../../api/order.ts";
import {parseTime} from "../../utils";

const props = defineProps([
  'order'
])
const productName = ref('')
const productUrl = ref('')
const productPrice = ref(-1) // unit price
const orderCreateTime = ref('')
const printState = computed(() => {
  return stateMap.get(props.order.invoiceStatus)
})
const stateTagType = computed(() => {
  return printState.value.type
})
const stateTagText = computed(() => {
  return printState.value.text
})

getProduct().then(res => {
  productName.value = res.productName
  productUrl.value = res.productImageUrl
  productPrice.value = res.productPrice
})
orderCreateTime.value = parseTime(props.order.invoiceTime)

function getProduct() {
  return productInfo(props.order.invoiceProductId)
}
</script>

<template>
  <router-link :to="'/orderdetail/' + props.order.invoiceId" v-slot="{navigate}">
    <el-card class="order-card" shadow="hover">
      <el-row>
        <el-col>
          <el-tag :type="stateTagType">{{ stateTagText }}</el-tag>
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12">
          <h1>{{ productName }}</h1>
          <p>
            <span><b>单价 : ￥{{ productPrice }}</b>&emsp;&emsp;</span>
            <span><b>数量 : {{ props.order.invoiceProductNum }}</b>&emsp;&emsp;</span>
            <span><b>总价 : ￥{{ props.order.invoicePrice }}</b></span>
          </p>
          <el-text tag="b">下单时间 : {{ orderCreateTime }}</el-text>
        </el-col>
        <el-col :span="4">
          <el-image :src="productUrl"></el-image>
        </el-col>
      </el-row>
    </el-card>
  </router-link>
</template>

<style scoped>
.order-card {
  background: aliceblue;
}

.order-card:hover {
  box-shadow: 0 0 10px 10px lavender;
}
</style>