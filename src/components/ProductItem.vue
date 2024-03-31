<!--Lab2新增-->
<!--商品列表父组件中的单个商品子组件-->
<script setup lang="ts">

const props = defineProps({
  productName: String,
  productDescription: String,
  productCoverUrl: String,
  productId: Number,
  productPrice: Number,
  storeId: Number,
})

</script>

<template>

  <router-link :to="'/storedetail/' + storeId + '/productdetail/' + productId" v-slot="{navigate}">
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
          <p class="product-dsc">{{productDescription}}</p>
          <el-tag class="product-price">￥{{productPrice}}.00</el-tag>
        </el-col>
      </el-row>
    </el-card>
  </router-link>

</template>

<style scoped>

.product-card {
  width: 450px;
  height: 320px;
  padding: 0;
  border-radius: 18px;
}

.el-card /deep/ .el-card__header {
  background: aliceblue;
}

.product-cover {
  width: 100%;
  height: 290px;
}

.cover-col {
  background: linear-gradient(90deg, aliceblue 60%, floralwhite);
}

.dtl-col {
  background: floralwhite;
}

.el-card /deep/ .el-card__body {
  padding: 0;
}

.product-name {
  text-decoration: none;
  color: darkslategray;
  letter-spacing: 2px;
  font-family: "Microsoft YaHei UI", serif;
  font-size: 170%;
}

.product-dsc {
  text-decoration: none;
  color: black;
  letter-spacing: 1px;
  text-indent: 20px;
  font-family: "Microsoft YaHei UI Light", serif;
}

.product-price {
  /* TODO: hope to put in bottom right */
}

</style>
