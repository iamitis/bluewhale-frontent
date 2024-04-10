<script setup lang="ts">
import {shipOrder} from "../api/order.ts";
import {ElMessage} from "element-plus";

const props = defineProps({
  orderId: Number,
  count: Number,
})

function confirmShip() {
  ElMessageBox.confirm(
      '确定为此订单发货吗？',
      {
        confirmButtonText: '确定',
        cancelButtonText: '还没想好',
        center: true,
      }
  ).then(() => {
    handleShip()
  })
}

function handleShip() {
  shipOrder({invoiceId: props.orderId}).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        message: "发货成功！",
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
  <div class="ship-box">
    <el-text size="large">
      发货数量 : &emsp;
      <el-tag type="warning">
        {{ count }}
      </el-tag>
    </el-text>
    <el-button
        @click="confirmShip"
        color="lightpink"
        class="pay-button">
      发货
    </el-button>
  </div>
</template>

<style scoped>
.ship-box {
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