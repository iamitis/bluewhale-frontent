<!--Lab2新增-商品详情界面-->
<script setup lang="ts">
import {ref} from "vue";
import {productInfo, getProductImages} from "../../api/product.ts";


const url = window.location.href
const productId = ref()
const productName = ref('')
const productType = ref('')
const productDescription = ref('')
const productImageUrls = ref([])

getProductId().then(res => {
  getProductInfo(res)
})

async function getProductId() {
  const args = url.split('/')
  productId.value = args[5]
  return productId.value
}

function getProductInfo(productId: number) {
  productInfo(productId).then(res => {
    productName.value = res.productName
    productType.value = res.productCategory
    productDescription.value = res.productDescription
  })
  getProductImages(productType.value, productId).then(res => {
    productImageUrls.value = res
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
      <el-scrollbar>
        <div class="scrollbar-flex-content">
          <p v-for="item in 50" :key="item" class="scrollbar-demo-item">
            {{}}
          </p>
        </div>
      </el-scrollbar>


    </el-main>
  </el-container>
</template>


<style scoped>
.page-aside {
  border-right: lightgrey solid 1px;
}


.scrollbar-flex-content {
  display: flex;
}

.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}


</style>
