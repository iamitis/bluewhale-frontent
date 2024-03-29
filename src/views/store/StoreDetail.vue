<!--Lab2新增-商店详情界面-->
<script setup lang="ts">
import {ref} from "vue";
import {storeInfo} from "../../api/store.ts";
import CreateProduct from "../product/CreateProduct.vue";

const url = window.location.href
const storeId = ref()
const storeName = ref('')
const description = ref('')
const logoUrl = ref('')

getStoreId().then(res => {
  getStoreInfo(res)
  sessionStorage.setItem('storeId', storeId + '')
})
async function getStoreId() {
  const args = url.split('/')
  storeId.value = args[5]
  return storeId.value
}

function getStoreInfo(storeId) {
  storeInfo(storeId).then(res => {
    storeName.value = res.storeName
    description.value = res.category
    logoUrl.value = res.imageUrl
  })
}

</script>


<template>
  <el-container>
    <!--希望把商店详情的一部分内容放在这个侧边栏里，你要真不想放也没事-->
    <el-aside width="25%" class="page-aside">
      <img src={{logoUrl}}  alt="logo"/>
      <h1>{{storeName}}</h1>
      <h1>{{description}}</h1>
    </el-aside>

    <el-main>
      <create-product />
    </el-main>
  </el-container>
</template>


<style scoped>
.page-aside {
  border-right: lightgrey solid 1px;
}
</style>
