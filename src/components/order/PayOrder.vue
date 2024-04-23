<script setup lang="ts">
import {payOrder} from "../../api/order.ts";
import {ElMessage} from "element-plus";
import {ref} from "vue";

const props = defineProps({
  orderId: Number,
  totalPrice: Number,
})
const emit = defineEmits(['payFinished'])
const payment = ref(props.totalPrice) // 现在还没有优惠券模块，先让用户自己输入实际付款金额

function confirmPay() {
  ElMessageBox.confirm(
      '确定支付此订单吗？',
      {
        confirmButtonText: '确定',
        cancelButtonText: '还没想好',
        center: true,
      }
  ).then(() => {
    handlePay()
  })
}

function handlePay() {
  payOrder({
    invoiceId: props.orderId,
    invoicePrice: payment.value
  }).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        message: "支付成功！",
        type: 'success',
        center: true,
      })
      emit("payFinished", true)
    } else if (res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
      emit("payFinished", false)
    }
  })
}
</script>

<template>
  <div class="pay-box">
      <el-text size="large">
        支付金额 : &emsp;
        <el-input-number
            v-model="payment"
            :precision="2"
            :step="0.1"
            :min="0"
            :max="props.totalPrice" />
      </el-text>
    <el-button
        @click="confirmPay"
        color="lightpink"
        class="pay-button">
      付款
    </el-button>
  </div>
</template>

<style scoped>
.pay-box {
  display: flex;
  display: -webkit-flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
}

.pay-button {
  margin-top: 25px;
  color: white;
}
</style>