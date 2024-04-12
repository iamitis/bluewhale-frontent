<script setup lang="ts">
import {formattedTime} from "../api/order.ts";
import {ref} from "vue";

const props = defineProps(['rate'])
const time = formattedTime(props.rate.time)
const colors = ref(['darkgrey', 'lightpink', 'lightcoral'])
</script>

<template>
  <el-card class="rate-card" shadow="never">
    <p style="margin-top: -5px">
      <span><el-tag color="lavenderblush" style="color: skyblue;">{{ props.rate.username }}</el-tag>&emsp;</span>
      <span><el-tag color="lavenderblush" style="color: skyblue;">{{ time }}</el-tag></span>
    </p>
    <el-rate
        v-model="props.rate.score"
        :colors="colors"
        style="margin-top: -8px"
        disabled/>
    <el-text tag="p">{{ props.rate.comment }}</el-text>
  </el-card>
</template>

<style scoped>
.rate-card {
  background: floralwhite;
}
</style>