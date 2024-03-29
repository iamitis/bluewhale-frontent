<!--Lab2新增-全部商店界面/主页-->
<script setup lang="ts">
import {ref} from "vue";
import CreateStore from "./components/CreateStore.vue";
import {allStoresInfo} from "../../api/store.ts";
import StoreItem from "../../components/StoreItem.vue";

const role = sessionStorage.getItem('role');
const storeList = ref([]);

getStoreInfo()

function getStoreInfo() {
  allStoresInfo().then(res => {
    storeList.value = res

  })
}

</script>


<template>
  <el-main class="main">
    <el-empty
        v-if="storeList === []"
        description="店家跑路了/_ \">
    </el-empty>

<<<<<<< HEAD
    <el-card
        v-else
        v-for="store in storeList">
      {{ store }}
    </el-card>
=======
    <StoreItem
        v-for="store in storeList"
        :store-name="store.storeName"
        :description="store.category"
        :store-id="store.storeId"/>
>>>>>>> 651c74040951b609b238be63a87669e322977114

    <create-store v-if="role === 'MANAGER'"/>
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
