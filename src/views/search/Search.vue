<script setup lang="ts">
import {ref} from "vue";
import {Search} from "@element-plus/icons-vue"
import ProductItem from "../../components/product/ProductItem.vue";
import {SearchInfo, searchProduct} from "../../api/search.ts";
import {typeList} from "../../api/product.ts";
import {allStoresInfo} from "../../api/store.ts";

const searchText = ref('')
const productList = ref([])
const drawer = ref(false)
const productType = ref('')
const storeList = ref([])
const chosenStore = ref<number>()
const minPrice = ref<number>()
const maxPrice = ref<number>()

handleSearch()
allStoresInfo().then((res: any[]) => {
  storeList.value = res
})

function handleSearch() {
  const searchInfo: SearchInfo = {
    store_id: chosenStore.value,
    name: searchText.value,
    type: productType.value,
    min_price: minPrice.value,
    max_price: maxPrice.value,
  }
  searchProduct(searchInfo)
      .then((res: any) => {
        productList.value = res
      })
}

function clearFilter() {
  productType.value = ''
  chosenStore.value = undefined
  minPrice.value = undefined
  maxPrice.value = undefined
  handleSearch()
}
</script>

<template>
  <el-container>
    <el-header height="60px" class="page-top">
      <div class="search">
        <el-input
            v-model="searchText"
            :prefix-icon="Search"
            placeholder="查找想要的商品"
            style="width: 50%">
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
        <el-button
            @click="drawer = true"
            color="skyblue"
            style="color: white">
          筛选
        </el-button>
      </div>
    </el-header>

    <el-main class="el-main">
      <el-empty
          v-if="productList.length === 0 && role !== 'STAFF'"
          description="找不到/_ \">
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
            :store-id="product.productStoreId"/>
      </template>

      <el-drawer v-model="drawer">
        <template #header>
          <h4>筛选商品</h4>
        </template>
        <template #default>
          <div class="filter">
            <label for="type">商品种类</label>
            <el-select
                id="type"
                v-model="productType"
                placeholder="选择商品种类">
              <el-option
                  v-for="type in typeList"
                  :label="type.value"
                  :value="type.key"/>
            </el-select>
            <label for="store">店铺</label>
            <el-select
                id="store"
                v-model="chosenStore"
                placeholder="选择售卖店铺">
              <el-option
                  v-for="store in storeList"
                  :label="store.storeName"
                  :value="store.storeId"/>
            </el-select>
            <label for="price">价格区间</label>
            <div id="price">
              <el-input-number
                  v-model="minPrice"
                  :step="10"
                  :precision="2"
                  :min="0"
                  placeholder="最低价"/>
              <el-text style="margin-left: 10px">-</el-text>
              <el-input-number
                  v-model="maxPrice"
                  :step="10"
                  :precision="2"
                  :min="0"
                  style="margin-left: 10px"
                  placeholder="最高价"/>
            </div>
            <el-button
                @click="() => {handleSearch(); drawer=false}"
                color="skyblue"
                style="color: white; align-self: start">
              确定
            </el-button>
          </div>
        </template>
        <template #footer>
          <el-button
              @click="() => {clearFilter(); drawer=false}"
              color="skyblue"
              style="color: white">
            重置
          </el-button>
        </template>
      </el-drawer>
    </el-main>
  </el-container>
</template>

<style scoped>
.page-top {
  background: floralwhite;
  display: flex;
  justify-content: center;
}

.search {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.filter {
  display: flex;
  flex-flow: column;
  gap: 20px;
}

.el-main {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  background: floralwhite;
  gap: 20px;
}
</style>