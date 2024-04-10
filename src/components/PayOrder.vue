<script setup lang="ts">
import {payOrder} from "../api/order.ts";
import {ElMessage} from "element-plus";

const props = defineProps({
  orderId: Number,
  totalPrice: Number,
})

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
  payOrder({invoiceId: props.orderId}).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        message: "支付成功！",
        type: 'success',
        center: true,
      })
      window.location.reload()
    } else if (res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}
</script>

<template>
  <div class="pay-box">
      <el-text size="large">
        支付金额 : &emsp;
        <el-tag type="warning">
          ￥{{ totalPrice }}
        </el-tag>
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