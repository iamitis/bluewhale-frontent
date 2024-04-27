<script setup lang="ts">
import {computed, ref} from "vue";
import CreateCoupon from "../../components/coupon/CreateCoupon.vue";
import {coupon2CouponGroup, getAllCoupon, getReceivedCoupon} from "../../api/coupon.ts";
import CouponItem from "../../components/coupon/CouponItem.vue";

const role = sessionStorage.getItem('role')
const createDialogVisible = ref(false)
const lookupReceive = ref(false)
const allCouponList = ref([])
const receivedList = ref([])

getCouponList()
getReceivedList()

function getCouponList() {
  getAllCoupon().then(res => {
    allCouponList.value = res
  })
}

function getReceivedList() {
  getReceivedCoupon().then(res => {
    receivedList.value = res
    receivedList.value = receivedList.value.filter(coupon => coupon.couponStatus !== 'EXPIRED')
  })
}

function handleLookup() {
  lookupReceive.value = !lookupReceive.value
  lookupReceive ? getReceivedList() : getCouponList()
}

function refresh(success: boolean) {
  if (success) {
    createDialogVisible.value = false
    getCouponList()
    getReceivedList()
  }
}
</script>

<template>
  <el-container>
    <el-header height="5%" class="page-top">
      <el-button
          v-if="role === 'CUSTOMER' && !lookupReceive"
          @click="handleLookup"
          class="aside-button"
          text>
        查看已领优惠券
      </el-button>
      <el-button
          v-if="role === 'CUSTOMER' && lookupReceive"
          @click="handleLookup"
          class="aside-button"
          text>
        去领优惠券
      </el-button>
      <el-button
          v-if="role === 'STAFF' || role === 'CEO'"
          @click="createDialogVisible = true"
          class="aside-button"
          text>
        发布优惠券组
      </el-button>
    </el-header>
    <el-main class="el-main">
      <div v-if="!lookupReceive" class="el-main">
        <el-empty
            v-if="allCouponList.length <= 0"
            description="没有可以领取的优惠券/_ \">
        </el-empty>
        <coupon-item
            v-for="coupon in allCouponList"
            :coupon="coupon"
            :is-group="true"
            @receive-finished="refresh"
            class="coupon-item"/>
      </div>
      <div v-if="lookupReceive" class="el-main">
        <el-empty
            v-if="receivedList.length <= 0"
            description="空空的/_ \">
        </el-empty>
        <coupon-item
            v-for="coupon in receivedList"
            :coupon="coupon2CouponGroup(coupon)"
            :is-group="false"
            @receive-finished="refresh"
            class="coupon-item"/>
      </div>
      <el-dialog
          v-model="createDialogVisible"
          draggable
          width="30%">
        <template #header>
          <el-text tag="h1" size="large">
            填写优惠券组信息
          </el-text>
        </template>
        <create-coupon @create-coupon-finished="refresh"/>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<style scoped>
.page-top {
  background: floralwhite;
  display: flex;
  flex-flow: row;
  justify-content: center;
}

.aside-button {
  background: floralwhite;
  color: skyblue;
  width: 100%;
}

.el-main {
  display: flex;
  display: -webkit-flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  background: floralwhite;
  gap: 30px;
}

.coupon-item {
  width: 400px
}

.coupon-item:hover {
  box-shadow: 0 0 10px 10px lavender;
}
</style>