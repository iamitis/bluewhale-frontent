<!--Lab2新增-商品详情界面-->
<script setup lang="ts">
import {computed, ref} from "vue";
import {productInfo, getProductImages, getAllRates} from "../../api/product.ts";
import UpdateProduct from "../../components/product/UpdateProduct.vue";
import CreateOrder from "../../components/order/CreateOrder.vue";
import {router} from "../../router";
import RateItem from "../../components/product/RateItem.vue";

const productId = ref(-1)
const productName = ref('')
const productType = ref('')
const productDescription = ref('')
const productCoverUrl = ref('')
const productPrice = ref(-1)
const productDetailImages = ref([])
const avgScore = ref()
const productSales = ref(-1)
const productStoreId = ref(-1)
const role = sessionStorage.getItem('role')
const storeIdOfUser = Number(sessionStorage.getItem('storeId'))
const orderDialogVisible = ref(false)
const rateList = ref([])
const allRateList = computed(() => {
  return rateList.value.filter((rate) => rate.score != null)
})
const positiveList = computed(() => {
  return allRateList.value.filter((rate) => rate.score === 5)
})
const middlingList = computed(() => {
  return allRateList.value.filter((rate) => rate.score >= 2 && rate.score <= 4)
})
const negativeList = computed(() => {
  return allRateList.value.filter((rate) => rate.score === 1)
})
const chosenList = ref([])
const option = ref('全部评论')
const rateOptions = ['全部评论', '好评', '中评', '差评']
const rateColor = ['darkgrey', 'lightpink', 'lightcoral']

getProductId().then(res => {
  getProductInfo(res)
  getAllRates(res).then((res) => {
    rateList.value = res
    chosenList.value = rateList.value.filter((rate) => rate.score != null)
  })
})

async function getProductId() {
  productId.value = Number(router.currentRoute.value.params.productId)
  return productId.value
}

function getProductInfo(productId: number) {
  productInfo(productId).then(res => {
    productName.value = res.productName
    productType.value = res.productCategory
    productDescription.value = res.productDescription
    productCoverUrl.value = res.productImageUrl
    productPrice.value = res.productPrice
    productSales.value = res.productSales
    productStoreId.value = res.productStoreId
    avgScore.value = res.productScore
  })
  getProductImages({imageBelong: 'PRODUCT', belongId: productId}).then(res => {
    productDetailImages.value = res
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
            class="product-info">

          <el-card class="product-cover-card" shadow="never">
            <el-image
                :src="productCoverUrl"
                alt="cover"
                fit="contain"
                class="product-cover"/>
          </el-card>

          <el-card class="product-name-card" shadow="never">
            <div class="product-name-row">
              <span class="product-name">{{ productName }}</span>
              <el-rate v-model="avgScore" :colors=rateColor allow-half disabled/>
              <p class="product-dsc">{{ productDescription }}</p>
            </div>
          </el-card>

          <el-card
              v-if="role === 'STAFF' && storeIdOfUser === productStoreId"
              class="sales-card"
              shadow="never">
            <el-tag class="sales">
              当前库存 {{ productSales }}
            </el-tag>
            <update-product :product-id="productId"/>
          </el-card>

          <el-card class="price-pay" shadow="never">
            <div>
              <el-tag class="product-price">
                ￥{{ productPrice }}
              </el-tag>

              <el-button
                  v-if="productSales > 0 && role === 'CUSTOMER'"
                  @click="orderDialogVisible = true"
                  class="order-button"
                  color="lightpink">
                立即购买
              </el-button>
              <el-tag
                  v-if="productSales <= 0"
                  color="darkgrey"
                  class="no-stock">
                商品抢光了>_&lt;
              </el-tag>
            </div>
          </el-card>

        </el-space>
      </el-affix>
    </el-aside>

    <el-main class="el-main">
      <el-carousel
          trigger="click"
          height="auto"
          indicator-position="outside"
          motion-blur>
        <el-carousel-item
            v-for="img in productDetailImages"
            style="height: 400px">
          <el-image
              :src="img.ossUrl"
              fit="contain"
              class="product-detail-image"/>
        </el-carousel-item>
      </el-carousel>

      <div class="rate-options-box">
        <el-radio-group v-model="option" fill="mistyrose" text-color="grey" class="rate-options">
          <el-radio-button :label="rateOptions[0]" @click="chosenList = allRateList"/>
          <el-radio-button :label="rateOptions[1]" @click="chosenList = positiveList"/>
          <el-radio-button :label="rateOptions[2]" @click="chosenList = middlingList"/>
          <el-radio-button :label="rateOptions[3]" @click="chosenList = negativeList"/>
        </el-radio-group>
      </div>

      <div class="rate-list-box">
        <rate-item
            v-if="chosenList.length > 0"
            v-for="rate in chosenList"
            :rate="rate"
            class="rate-item"/>
        <el-empty
            v-if="chosenList.length <= 0"
            description="什么也没有/_ \"/>
      </div>

      <el-dialog
          class="order-dialog"
          v-model="orderDialogVisible"
          width="20%"
          draggable
          :title="'购买 ' + productName">
        <el-image :src="productCoverUrl" class="order-image"/>
        <p>当前仅剩 : {{ productSales }}</p>
        <create-order
            :product-id="productId"
            :product-name="productName"
            :product-price="productPrice"
            :product-store-id="productStoreId"
            :product-sales="productSales"/>
      </el-dialog>
    </el-main>
  </el-container>
</template>


<style scoped>
.page-aside {
  background: floralwhite;
  border-right: lightgrey solid 1px;
}

.product-info {
  width: 100%;
}

.product-cover-card {
  background: floralwhite;
  width: 90%;
}

.product-cover {
  width: 90%;
  height: 90%;
}

.product-name-card {
  background: floralwhite;
  text-align: center;
}

.product-name {
  display: block;
  text-decoration: none;
  color: darkslategray;
  letter-spacing: 2px;
  font-family: "Microsoft YaHei UI", serif;
  font-size: 170%;
}

.product-dsc {
  text-align: start;
  text-indent: 20px;
  font-family: "Microsoft YaHei UI Light", serif;
  color: black;
  text-decoration: none;
  letter-spacing: 1px;
}

.product-detail-image {
  height: 100%;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.sales-card {
  background: floralwhite;
  text-align: center;
}

.sales {
  font-size: 120%;
  height: 40px;
  width: 150px;
}

.price-pay {
  background: floralwhite;
  display: flex;
  justify-content: center;
}

.el-main {
  display: flex;
  display: -webkit-flex;
  flex-flow: column;
  background: linear-gradient(to right, floralwhite 0%, aliceblue 50%);
  gap: 20px;
}

.product-price {
  height: 50px;
  width: 100px;
  font-size: 120%;
  text-indent: -10px;
}

.order-button {
  height: 48px;
  width: 100px;
  font-size: 120%;
  margin-left: 20px;
  color: steelblue;
}

.no-stock {
  height: 48px;
  width: 150px;
  font-size: 110%;
  margin-left: 20px;
  color: black;
}

.order-dialog {
}

.order-image {
  width: 90%;
  margin-bottom: 10px;
}

.rate-list-box {
  width: 100%;
  display: flex;
  display: -webkit-flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  gap: 20px;
}

.rate-item {
  width: 46%;
}

.rate-options-box {

}

.rate-options {
  margin-left: 2%;
}
</style>
