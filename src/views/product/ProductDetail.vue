<!--Lab2新增-商品详情界面-->
<script setup lang="ts">
import {ref} from "vue";
import {productInfo, getProductImages} from "../../api/product.ts";


const url = window.location.href
const productId = ref()
const productName = ref('')
const productType = ref('')
const productDescription = ref('')
const imageUrls = ref([])

getProductId().then(res => {
  getProductInfo(res)
  sessionStorage.setItem('productId', productId + '')
})

async function getProductId() {
  const args = url.split('/')
  productId.value = args[5]
  return productId.value
}

function getProductInfo(productId: number) {
  productInfo(productId).then(res => {
    productName.value = res.productName
    productType.value = res.category
    productDescription.value = res.description
  })
  getProductImages(productType.value, productId).then(res => {
    imageUrls.value = res

  })
}

</script>


<template>
  <el-container>
    <!--希望把商品详情的一部分内容放在这个侧边栏里，你要真不想放也没事-->
    <el-aside width="25%" class="page-aside">
      <h1>{{ productName }}</h1>
      <h1>{{ productType }}</h1>
      <h1>{{ productDescription }}</h1>
    </el-aside>


    <el-main>

    </el-main>
  </el-container>
</template>


<style scoped>
.page-aside {
  border-right: lightgrey solid 1px;
}
</style>
