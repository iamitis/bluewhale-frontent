<!--Lab2新增-全部商店界面/主页-->
<script setup lang="ts">
import {ref} from "vue";
import CreateStore from "./components/CreateStore.vue";
import {allStoreInfo} from "../../api/store.ts";

const role = sessionStorage.getItem('role');
const storeList = ref([]);

getStoreInfo()

function getStoreInfo() {
  allStoreInfo().then(res => {
    storeList.value = res
  })
}

</script>


<template>
  <el-main class="main">

    <el-empty
        v-if="storeList === []"
        description="店家跑路了/_ \">
      <create-store v-if="role === 'MANAGER'"/>
    </el-empty>

    <el-card
        v-else
        v-for="store in storeList">
      {{store}}
    </el-card>

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
}

</style>
