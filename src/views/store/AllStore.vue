<!--Lab2新增-全部商店界面/主页-->
<script setup lang="ts">
import {computed, ref} from "vue";
import CreateStore from "../../components/store/CreateStore.vue";
import {allStoresInfo} from "../../api/store.ts";
import StoreItem from "../../components/store/StoreItem.vue";

const role = sessionStorage.getItem('role');
const storeList = ref([]);

getStoreInfo()

function getStoreInfo() {
  allStoresInfo().then(res => {
    storeList.value = res
  })
}

function refresh(success: boolean) {
  if (success) {
    getStoreInfo()
  }
}

</script>


<template>
  <el-container>
    <el-main class="main">
      <el-empty
          v-if="storeList.length === 0"
          description="商场倒闭了/_ \">
      </el-empty>

      <template v-else>
        <StoreItem
            style="text-decoration: none"
            v-for="store in storeList"
            class="list-item"
            :store-name="store.storeName"
            :description="store.storeDescription"
            :store-id="store.storeId"
            :store-score="store.storeScore"
            :logo-url="store.storeImageUrl"/>
      </template>
      <create-store
          @create-store-finished="refresh"
          v-if="role === 'MANAGER'"
          class="create-button"/>
    </el-main>
  </el-container>
</template>


<style scoped>
.main {
  background: aliceblue;
  display: flex;
  display: -webkit-flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: 30px;
}

.create-button {
}
</style>
