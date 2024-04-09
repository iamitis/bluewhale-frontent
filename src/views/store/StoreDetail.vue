<!--Lab2新增-商店详情界面/展示商店所有商品-->
<script setup lang="ts">
import {ref} from "vue";
import {allProductsInfo, storeInfo} from "../../api/store.ts";
import CreateProduct from "../../components/CreateProduct.vue";
import ProductItem from "../../components/ProductItem.vue";
import {router} from "../../router";
import {ShoppingTrolley} from "@element-plus/icons-vue";

const url = window.location.href
let storeId = 0
const storeName = ref('')
const storeIdOfUser = Number(sessionStorage.getItem('storeId'))
const description = ref('')
const logoUrl = ref('')
const productList = ref([])
const storeScore = ref(5)
const role = sessionStorage.getItem('role')

getStoreId().then(res => {
  getStoreInfo(res)
})

async function getStoreId() {
  //const args = url.split('/')
  //storeId = parseInt(args[5])
  storeId = Number(router.currentRoute.value.params.storeId)
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
  })
}


</script>


<template>
  <el-container>
    <el-aside width="20%" class="page-aside">
      <el-affix :offset="65">
        <el-space
            fill
            :size="0"
            direction="vertical"
            class="store-info">

          <el-card class="store-logo-card" shadow="never">
            <el-image
                :src="logoUrl"
                alt="logo"
                fit="contain"
                class="store-logo"/>
          </el-card>

          <el-card class="store-name-card" shadow="never">
            <div class="store-name-row">
              <span class="store-name">{{ storeName }}</span>
              <el-rate v-model="storeScore"/>
              <p class="store-dsc">{{ description }}</p>
            </div>
          </el-card>

        </el-space>
      </el-affix>
    </el-aside>

    <el-main class="main">
      <el-empty
          v-if="productList.length === 0"
          description="店家跑路了/_ \">
        <el-button
            text
            type="primary"
            class="empty-button"
            @click="() => {router.push('allstore')}">
          > 看看别的店
          <el-icon class="el-icon--right"><shopping-trolley /></el-icon>
        </el-button>
      </el-empty>

      <template v-else>
        <product-item
            v-for="product in productList"
            :key="product.productSales"
            :product-cover-url="product.productImageUrl"
            :product-description="product.productDescription"
            :product-id="product.productId"
            :product-name="product.productName"
            :product-price="product.productPrice"
            :store-id="storeId"/>
      </template>
      <create-product :store-id="storeId" v-if="role === 'STAFF' && storeId === storeIdOfUser"/>
    </el-main>
  </el-container>
</template>


<style scoped>
.page-aside {
  background: floralwhite;
  border-right: lightgrey solid 1px;
}

.main {
  background: linear-gradient(to right, floralwhite 0%, aliceblue 20%);
  display: flex;
  display: -webkit-flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: 20px;
}

.store-info {
  width: 100%;
}

.store-logo-card {
  background: floralwhite;
  width: 90%;
}

.store-logo {
  width: 90%;
  height: 90%;
}

.store-name-card {
  background: floralwhite;
  text-align: center;
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

.create-button {
  /* TODO: hope proper position */
}
</style>
