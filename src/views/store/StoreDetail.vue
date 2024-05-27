<!--Lab2新增-商店详情界面/展示商店所有商品-->
<script setup lang="ts">
import {ref} from "vue";
import {allProductsInfo, storeInfo} from "../../api/store.ts";
import CreateProduct from "../../components/product/CreateProduct.vue";
import ProductItem from "../../components/product/ProductItem.vue";
import {router} from "../../router";
import {Location, ShoppingTrolley} from "@element-plus/icons-vue";

let storeId = 0
const storeName = ref('')
const storeIdOfUser = Number(sessionStorage.getItem('storeId'))
const description = ref('')
const storeAddress = ref('')
const logoUrl = ref('')
const productList = ref([])
const storeScore = ref(5)
const scoreCount = ref(0)
const role = sessionStorage.getItem('role')

getStoreId().then(res => {
  getStoreInfo(res)
})

async function getStoreId() {
  storeId = Number(router.currentRoute.value.params.storeId)
  return storeId
}

function getStoreInfo(storeId: number) {
  storeInfo(storeId).then(res => {
    storeName.value = res.storeName
    description.value = res.storeDescription
    storeAddress.value = res.storeAddress
    logoUrl.value = res.storeImageUrl
    storeScore.value = res.storeScore
    scoreCount.value = res.storeCommentNum
  })
}

getProductsInfo()

function getProductsInfo() {
  allProductsInfo(storeId).then(res => {
    productList.value = res
  })
}

function refresh(success: boolean) {
  if (success) {
    getProductsInfo()
  }
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
              <el-rate
                  v-model="storeScore"
                  disabled
                  allow-half
                  :colors="['darkgrey', 'lightpink', 'lightcoral']"/>
              <p style="height: 15px; margin-top: -8px">
                <el-tag v-if="scoreCount != null" type="info" style="height: 14px" size="small">
                  {{ scoreCount }}人评分
                </el-tag>
                <el-tag v-if="scoreCount == null" type="info" style="height: 14px" size="small">
                  暂无评分
                </el-tag>
              </p>
              <p class="store-dsc">{{ description }}</p>
              <p class="store-address">
                <el-tag type="info" round>
                  <el-icon>
                    <location/>
                  </el-icon>
                  {{ storeAddress }}
                </el-tag>
              </p>
            </div>
          </el-card>

          <create-product :store-id="storeId" v-if="role === 'STAFF' && storeId === storeIdOfUser"
                          @create-product-finished="refresh"/>

        </el-space>
      </el-affix>
    </el-aside>

    <el-main class="main">
      <el-empty
          v-if="productList.length === 0 && role !== 'STAFF'"
          description="店家跑路了/_ \">
        <el-button
            text
            type="primary"
            class="empty-button"
            @click="() => {router.push('/allstore')}">
          > 看看别的店
          <el-icon class="el-icon--right">
            <shopping-trolley/>
          </el-icon>
        </el-button>
      </el-empty>

      <template v-else>
        <product-item
            style="text-decoration: none"
            v-for="product in productList"
            :key="product.productSales"
            :product-cover-url="product.productImageUrl"
            :product-description="product.productDescription"
            :product-id="product.productId"
            :product-name="product.productName"
            :product-price="product.productPrice"
            :product-score="product.productScore"
            :store-id="storeId"/>
      </template>
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
  font-family: "Microsoft YaHei UI Light", serif;
  color: black;
  text-decoration: none;
  letter-spacing: 1px;
}

.store-address {
  text-align: start;
  font-family: "Microsoft YaHei UI Light", serif;
  font-size: 90%;
  color: black;
  margin-bottom: -8px;
}

.store-name-row {
  display: flex;
  flex-flow: column;
  align-items: center;
}

.create-button {
  /* TODO: hope proper position */
}
</style>
