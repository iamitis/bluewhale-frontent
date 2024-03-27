<!--Lab2新增-全部商店界面/主页-->
<script setup lang="ts">
import {ref} from "vue";
import CreateStore from "./components/CreateStore.vue";

const role = sessionStorage.getItem('role');
const storeList = ref([]);

</script>


<template>
  <el-main class="main">

    <el-empty
        v-if="storeList.length === 0"
        description="店家跑路了/_ \">
      <create-store />
    </el-empty>

    <el-card
        v-else
        v-for="store in storeList">
    </el-card>
    <create-store v-else/>

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
