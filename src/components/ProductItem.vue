<!--Lab2新增-->
<!--商品列表父组件中的单个商品子组件-->
<script setup lang="ts">

const props = defineProps({
  productName: String,
  productDescription: String,
  productCoverUrl: String,
  productId: Number,
  productPrice: Number,
})

</script>

<template>

  <router-link to="'/productDetail/' + productId" v-slot="{navigate}">
    <el-card
        class="product-card"
        shadow="always">
      <template #header>
        <span class="product-name"><b>{{productName}}</b></span>
      </template>
      <el-row
          gutter="12"
          class="card-body">
        <el-col
            :span="12"
            class="cover-col">
          <el-image
              :src="productCoverUrl"
              alt="cover"
              class="product-cover"
              fit="contain"/>
        </el-col>
        <el-col
            :span="12"
            class="dtl-col">
          <p class="store-dsc">{{productDescription}}</p>

        </el-col>
      </el-row>
    </el-card>
  </router-link>

</template>

<style scoped>

</style>
