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

const total = ref(0)
const min = computed(() => 5 <= total.value ? 5 : total.value)
const count = ref(min.value)
const loading = ref(false)
const nomore = computed(() => count.value >= total.value)
const disabled = computed(() => loading.value || nomore.value)
const load = () => {
  loading.value = true
  setTimeout(() => {
    count.value += 5
    loading.value = false
  }, 1000)
}
</script>


<template>
  <el-main class="main">
    <el-empty
        v-if="storeList === []"
        description="店家跑路了/_ \">
    </el-empty>

    <template v-else>
    <div
        class="infinite-list-wrapper">
      <ul
          v-infinite-scroll="load"
          infinite-scroll-distance="10"
          class="list"
          :infinite-scroll-disabled="disabled">
        <StoreItem
            v-for="(store,index) in storeList.slice(0, count)"
            :key="index"
            class="list-item"
            :store-name="store.storeName"
            :description="store.category"
            :store-id="store.storeId"
            :logo-url="store.imageUrl"/>
        <p>{{storeList[0]}}</p>
      </ul>
      <p v-if="loading">加载中...</p>
      <p v-if="nomore && total > 3">没有更多了/_ \</p>
    </div>

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

.infinite-list-wrapper {
  height: calc(100vh);
}

.infinite-list-wrapper .list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list-wrapper .list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-primary);
}

.infinite-list-wrapper .list-item + .list-item {
  margin-top: 10px;
}

</style>
