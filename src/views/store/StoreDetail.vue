<!--Lab2新增-商店详情界面/展示商店所有商品-->
<script setup lang="ts">
import {ref} from "vue";
import {allProductsInfo, storeInfo} from "../../api/store.ts";
import CreateProduct from "../product/CreateProduct.vue";
import StoreItem from "../../components/StoreItem.vue";
import CreateStore from "./components/CreateStore.vue";

const url = window.location.href
let storeId = 0
const storeName = ref('')
const description = ref('')
const logoUrl = ref('')

const productList = ref([])
const total = ref(0)

const storeScore = ref(5)

getStoreId().then(res => {
  getStoreInfo(res)
})

async function getStoreId() {
  const args = url.split('/')
  storeId = parseInt(args[5])
  return storeId
}

function getStoreInfo(storeId: number) {
  storeInfo(storeId).then(res => {
    storeName.value = res.storeName
    description.value = res.category
    logoUrl.value = res.storeImageUrl
  })
}

getProductsInfo()

function getProductsInfo() {
  allProductsInfo(storeId).then(res => {
    productList.value = res
    total.value = productList.value.length
  })
}


</script>


<template>
  <el-container>
    <el-aside width="25%" class="page-aside">
      <el-space
          fill
          fill-ratio="90"
          size="large"
          direction="vertical">

        <el-card class="store-logo-card">
          <el-image
              :src="logoUrl"
              alt="logo"
              fit="contain"
              class="store-logo"/>
        </el-card>

        <el-card class="store-name-card">
          <div class="store-name-row">
            <span class="store-name">{{ storeName }}</span>
            <el-rate v-model="storeScore"/>
            <p class="store-dsc">{{ description }}</p>
          </div>
        </el-card>

      </el-space>
    </el-aside>

    <el-main class="main">
      <create-product :store-id="storeId"/>

      <el-empty
          v-if="productList === []"
          description="店家跑路了/_ \">
      </el-empty>

      <template v-else>
        <div
            class="infinite-list-wrapper">
          <ul
              v-infinite-scroll="load"
              infinite-scroll-distance="10"
              class="list"
              :infinite-scroll-disabled="disabled">
            <StoreItem
                v-for="(product,index) in productList.slice(0, count)"
                :key="index"
                class="list-item"
                :product-name="product.productName"
                :type="product.productType"
                :product-id="product.productId"/>
          </ul>
          <p v-if="loading">加载中...</p>
          <p v-if="nomore && total > 3">没有更多了/_ \</p>
        </div>

        <create-store v-if="role === 'MANAGER'"/>
      </template>

    </el-main>
  </el-container>
</template>


<style scoped>
.page-aside {
  border-right: lightgrey solid 1px;
}

.store-logo-card {
  background: aliceblue;
  border-radius: 20px;
}
.store-logo {
  width: 90%;
  height: 90%;
}

.store-name-card {
  text-align: center;
  border-radius: 20px;
}
.store-name {
  display: block;
  text-decoration: none;
  color: darkslategray;
  letter-spacing: 2px;
  font-family: "Microsoft YaHei UI", serif;
  font-size: 170%;
}

.store-dsc {
  text-align: start;
  text-indent: 20px;
  font-family: "Microsoft YaHei UI Light", serif;
  color: black;
  text-decoration: none;
  letter-spacing: 1px;
}
</style>
