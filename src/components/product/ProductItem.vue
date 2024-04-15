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
  productScore: Number,
})

</script>

<template>

  <router-link :to="'/storedetail/' + storeId + '/productdetail/' + productId" v-slot="{navigate}">
    <el-card
        class="product-card"
        shadow="always">
      <template #header>
        <div style="display: flex; justify-content: space-between">
          <span class="product-name"><b>{{ productName }}</b></span>
          <el-rate
              v-if="productScore != null"
              v-model="props.productScore"
              :colors="['darkgrey', 'lightpink', 'lightcoral']"
              disabled />
        </div>
      </template>
      <el-row
          :gutter="12"
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
          <el-text tag="p" class="product-dsc">{{ productDescription }}</el-text>
          <el-tag size="large" class="product-price">￥{{ productPrice }}</el-tag>
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

.product-card:hover {
  box-shadow: 0 0 10px 10px lavender;
}

.el-card /deep/ .el-card__header {
  background: aliceblue;
}

.product-cover {
  width: 100%;
  height: 290px;
  margin-top: -10%;
}

.cover-col {
  background: linear-gradient(to right, aliceblue 60%, floralwhite);
}

.dtl-col {
  display: flex;
  display: -webkit-flex;
  flex-flow: column;
  justify-content: start;
  height: 260px;
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
  margin-top: 20%;
  /*color: black;
  letter-spacing: 1px;
  text-indent: 20px;
  font-family: "Microsoft YaHei UI Light", serif;*/
}

.product-price {
  width: max-content;
  align-self: start;
  margin-top: 10%;
  font-size: 90%;
}

</style>
