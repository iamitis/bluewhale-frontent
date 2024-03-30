<!--Lab2新增-->
<!--商店列表父组件中的单个商店子组件-->
<script setup lang="ts">

import {computed, ref} from "vue";

const props = defineProps({
  storeName: String,
  description: String,
  logoUrl: String,
  storeId: Number
})

</script>

<template>

  <router-link :to="'/storeDetail/'+storeId" v-slot="{navigate}">
    <el-card
        class="store-card"
        shadow="always">
      <template #header>
        {{storeName}}
      </template>
      <p>{{description}}</p>
      <el-image src="props.logoUrl" alt="logo" />
      <p>{{logoUrl}}0</p>
    </el-card>
  </router-link>

</template>

<style scoped>
.store-card {
  width: 680px;
  height: 250px;
}
</style>
