<!--Lab2新增-商品详情界面-->
<script setup lang="ts">
import {computed, ref} from "vue";
import {productInfo, getProductImages, updateProductSales} from "../../api/product.ts";
import {ElMessage} from "element-plus";

const url = window.location.href
const productId = ref(-1)
const productName = ref('')
const productType = ref('')
const productDescription = ref('')
const productCoverUrl = ref('')
const productPrice = ref(-1)
const productDetailImages = ref([])
const productScore = ref(5)
const productSales = ref(-1)
const dialogFormVisible = ref(false)
const addSalesNum = ref()
const addDisabled = computed(() => (1 <= addSalesNum))

getProductId().then(res => {
  getProductInfo(res)
})

async function getProductId() {
  const args = url.split('/')
  productId.value = parseInt(args[7])
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
  })
  getProductImages({imageBelong: 'PRODUCT', belongId: productId}).then(res => {
    productDetailImages.value = res
  })
}

function addProductSales() {
  updateProductSales(
      {
        productId: productId.value,
        productSales: parseInt(addSalesNum.value)
      }
  ).then(res => {
    if (res.data.code === '000') {
      ElMessage( {
        message: "添加库存成功！",
        type: 'success',
        center: true,
      })
    } else if (res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

function confirmAdd() {
  ElMessageBox.confirm(
      '确定要添加库存吗？',
      {
        confirmButtonText: '确定',
        cancelButtonText: '还没想好',
        center: true,
      }
  ).then(() => {
    addProductSales()
  })
}

</script>


<template>
  <el-container>
    <el-aside width="20%" class="page-aside">
      <el-affix :offset="80">
        <el-space
            fill
            size="small"
            direction="vertical"
            class="product-info">

          <el-card class="product-cover-card">
            <el-image
                :src="productCoverUrl"
                alt="cover"
                fit="contain"
                class="product-cover"/>
          </el-card>

          <el-card class="product-name-card">
            <div class="product-name-row">
              <span class="product-name">{{ productName }}</span>
              <el-rate v-model="productScore"/>
              <p class="product-dsc">{{ productDescription }}</p>
            </div>
          </el-card>

          <el-card class="sales-card">
            <el-tag class="sales">
              当前库存  {{ productSales }}
            </el-tag>
            <el-button
                class="update-sales"
                type="primary"
                text
                round
                @click="dialogFormVisible = true">
              添加库存
            </el-button>
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

      <el-tag
          class="product-price">
        ￥{{ productPrice }}.00
      </el-tag>

      <el-dialog
          v-model="dialogFormVisible"
          width="20%"
          draggable
          title="添加商品库存">
        <el-form>
          <el-form-item label="添加数量">
            <el-input
              v-model="addSalesNum"
              clearable />
          </el-form-item>

          <span class="add-button">
            <el-button
                @click="confirmAdd"
                :disabled="addDisabled"
                type="primary">
              添加
            </el-button>
          </span>
        </el-form>
      </el-dialog>
    </el-main>
  </el-container>
</template>


<style scoped>
.page-aside {
  background: aliceblue;
  border-right: lightgrey solid 1px;
}

.product-info {
  width: 100%;
}

.product-cover-card {
  background: floralwhite;
  border-radius: 20px;
  width: 90%;
}

.product-cover {
  width: 90%;
  height: 90%;
}

.product-name-card {
  background: floralwhite;
  text-align: center;
  border-radius: 20px;
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
  border-radius: 20px;
}

.sales {
  font-size: 120%;
  height: 40px;
  width: 150px;
}

.el-main {
  background: aliceblue;
}
.product-price {
  height: 50px;
  width: 100px;
  font-size: 120%;
  text-indent: -10px;
}
</style>
