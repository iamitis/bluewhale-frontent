<!--Lab2新增-->
<!--商店列表父组件中的单个商店子组件-->
<script setup lang="ts">

import {computed, ref} from "vue";

const props = defineProps({
  storeName: String,
  description: String,
  logoUrl: String,
  storeId: Number,
})


</script>

<template>

  <router-link :to="'/storeDetail/'+storeId" v-slot="{navigate}">
    <el-card
        class="store-card"
        shadow="always">
      <template #header>
        <span class="store-name">{{storeName}}</span>
      </template>
      <el-row
          gutter="12"
          class="card-body">
      <el-col
          :span="12"
          class="logo-col">
      <el-image
          :src="logoUrl"
          alt="logo"
          class="store-logo"
          fit="contain"/>
      </el-col>
      <el-col
          :span="12"
          class="dsc-col">
        <p>{{description}}</p>
      </el-col>
      </el-row>
    </el-card>
  </router-link>

</template>

<style scoped>
.store-card {
  width: 480px;
  height: 350px;
  padding: 0;
}

.el-card /deep/ .el-card__header {
  background-color: skyblue;
}

.store-logo {
  width: 100%;
  height: 290px;
}

.logo-col {
  background-color: aliceblue;
}

.dsc-col {
  background-color: floralwhite;
}

.el-card /deep/ .el-card__body {
  padding: 0;
}
</style>
