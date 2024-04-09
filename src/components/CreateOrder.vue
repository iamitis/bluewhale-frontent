<script setup lang="ts">
import {computed, reactive, ref} from "vue";

const props = defineProps({
  productId: Number,
  productName: String,
  productSales: Number,
  productPrice: Number,
})
const count = ref(1)
const pickup = ref('')
const address = ref('')
const hasPickup = computed(() => pickup.value !== '')
const hasAddress = computed(() => address.value !== '')

function checkForm() {
  if (!hasPickup.value) {
    ElMessage.warning('请选择取货方式')
    return false
  } else if (pickup.value === 'DELIVERY' && !hasAddress.value) {
    ElMessage.warning('请填写收货地址')
    return false
  } else {
    handleCreate()
  }
}

function handleCreate() {
  // TODO
}
</script>

<template>
  <el-form
      class="order-form"
      label-position="left">
    <el-form-item label="购买数量">
      <el-input-number
          v-model="count"
          :min="1"
          :max="props.productSales" />
    </el-form-item>
    <el-form-item label="取货方式">
        <el-radio v-model="pickup" label="DELIVERY" size="large">快递送达</el-radio>
        <el-radio v-model="pickup" label="PICKUP" size="large">到店自提</el-radio>
    </el-form-item>
    <el-form-item v-if="pickup === 'DELIVERY'" label="收获地址">
      <el-input v-model="address"></el-input>
    </el-form-item>
    <span>总价 : ￥{{count*productPrice}}</span>
    <span class="create-button-box">
        <el-button
            class="create-button"
            @click="checkForm"
            color="lightpink">
          下单
        </el-button>
      </span>
  </el-form>
</template>

<style scoped>
.order-form {}
.create-button-box {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  justify-content: right;
}
.create-button {
  color: steelblue;
}
</style>