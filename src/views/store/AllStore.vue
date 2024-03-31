<!--Lab2新增-全部商店界面/主页-->
<script setup lang="ts">
import {computed, ref} from "vue";
import CreateStore from "./components/CreateStore.vue";
import {allStoresInfo} from "../../api/store.ts";
import StoreItem from "../../components/StoreItem.vue";

const role = sessionStorage.getItem('role');
const storeList = ref([]);

getStoreInfo()

function getStoreInfo() {
  allStoresInfo().then(res => {
    storeList.value = res
    total.value = storeList.value.length
  })
}

</script>


<template>
  <el-main class="main">
    <el-empty
        v-if="storeList === []"
        description="店家跑路了/_ \">
    </el-empty>

    <template v-else>
      <StoreItem
          v-for="store in storeList"
          class="list-item"
          :store-name="store.storeName"
          :description="store.category"
          :store-id="store.storeId"
          :logo-url="store.storeImageUrl"/>

      <create-store v-if="role === 'MANAGER'"/>
    </template>
  </el-main>
</template>


<style scoped>
.main {
  display: flex;
  display: -webkit-flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: 20px;
}


</style>
