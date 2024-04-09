<!--Lab2新增-->
<!--商店列表父组件中的单个商店子组件-->
<script setup lang="ts">

const props = defineProps({
  storeName: String,
  description: String,
  logoUrl: String,
  storeId: Number,
})

</script>

<template>

  <router-link :to="'/storedetail/'+storeId" v-slot="{navigate}">
    <el-card
        class="store-card"
        shadow="always">
      <template #header>
        <span class="store-name"><b>{{ storeName }}</b></span>
      </template>
      <el-row
          :gutter="12"
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
          <p class="store-dsc">{{ description }}</p>
        </el-col>
      </el-row>
    </el-card>
  </router-link>

</template>

<style scoped>
.store-card {
  width: 450px;
  height: 320px;
  padding: 0;
  border-radius: 18px;
}

.store-card:hover{
  box-shadow: 0 0 10px 10px lavender;
}

.el-card /deep/ .el-card__header {
  background-color: skyblue;
}

.store-logo {
  width: 100%;
  height: 290px;
}

.logo-col {
  background: linear-gradient(90deg, aliceblue 60%, floralwhite);
}

.dsc-col {
  background: floralwhite;
}

.el-card /deep/ .el-card__body {
  padding: 0;
}

.store-name {
  text-decoration: none;
  color: darkslategray;
  letter-spacing: 2px;
  font-family: "Microsoft YaHei UI", serif;
  font-size: 170%;
}

.store-dsc {
  text-decoration: none;
  color: black;
  letter-spacing: 1px;
  text-indent: 20px;
  font-family: "Microsoft YaHei UI Light", serif;
}
</style>
