<script setup lang="ts">
import {cancelOrder} from "../../api/order.ts";
import {ElMessage} from "element-plus";
import {router} from "../../router";

const props = defineProps({
  orderId: Number,
})

function handleCancel() {
  cancelOrder({
    invoiceId: props.orderId,
  }).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        message: "取消订单成功！",
        type: 'success',
        center: true,
      })
      router.replace("/allorder")
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
  <div class="cancel-box">
    <el-button
        @click="handleCancel"
        color="gray"
        class="cancel-button">
      确定取消
    </el-button>
  </div>
</template>

<style scoped>
.cancel-box {
  display: flex;
  display: -webkit-flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
}

.cancel-button {
  margin-top: 25px;
  color: white;
}
</style>