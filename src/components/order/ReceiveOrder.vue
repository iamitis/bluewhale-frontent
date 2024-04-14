<script setup lang="ts">
import {receiveOrder} from "../../api/order.ts";
import {ElMessage} from "element-plus";

const props = defineProps({
  orderId: Number,
  count: Number,
})

function confirmReceive() {
  ElMessageBox.confirm(
      '确定商品已签收？',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
      }
  ).then(() => {
    handleReceive()
  })
}

function handleReceive() {
  receiveOrder({invoiceId: props.orderId}).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        message: "确认收货成功！",
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
  <div class="receive-box">
    <el-text size="large">
      应签收商品数量 : &emsp;
      <el-tag type="warning">
        {{ count }}
      </el-tag>
    </el-text>
    <el-button
        @click="confirmReceive"
        color="deepskyblue"
        class="receive-button">
      收货
    </el-button>
  </div>
</template>

<style scoped>
.receive-box {
  display: flex;
  display: -webkit-flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
}

.receive-button {
  margin-top: 25px;
  color: white;
}
</style>