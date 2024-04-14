<script setup lang="ts">
import {ref} from "vue";
import {rateOrder} from "../../api/order.ts";
import {ElMessage} from "element-plus";

const props = defineProps({
  orderId: Number,
})
const score = ref(5)
const comment = ref('')

function handleRate() {
  if (comment.value === '') {
    comment.value = '该用户默认评价了该商品'
  }
  rateOrder({
    invoiceId: props.orderId,
    score: score.value,
    comment: comment.value,
  }).then(res => {
    if (res.data.code === '000'){
      ElMessage({
        message: "评价成功！",
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
  <div class="rate-box">
    <span>您对此次购物是否满意？</span>
    <el-rate v-model="score" />
    <span>欢迎您来评价</span>
    <el-input
        v-model="comment"
        maxlength="300"
        show-word-limit
        type="textarea" />
    <el-button
        @click="handleRate"
        class="rate-button"
        color="floralwhite">
      提交
    </el-button>
  </div>
</template>

<style scoped>
.rate-box {
  display: flex;
  display: -webkit-flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
}

.rate-button {
  margin-top: 25px;
}
</style>