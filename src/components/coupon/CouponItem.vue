<script setup lang="ts">
import {computed, ref} from "vue";
import {storeInfo} from "../../api/store.ts";
import {couponStateMap, getCouponNote, receiveCoupon, timeMap} from "../../api/coupon.ts";
import {ElMessage} from "element-plus";
import {Warning} from "@element-plus/icons-vue"

const props = defineProps(['coupon', 'isGroup'])
const emit = defineEmits(['receiveFinished'])
const role = sessionStorage.getItem('role')
const storeName = ref('')
const storeCover = ref('')
const couponStateText = computed(() => {
  if (props.coupon.couponGroupCategory === 'FullReduction') {
    return '满减券'
  } else if (props.coupon.couponGroupCategory === 'SpecialCoupon') {
    return '蓝鲸券'
  } else {
    return 'error'
  }
})

getStoreInfo()

function getStoreInfo() {
  storeInfo(props.coupon.couponGroupStoreId).then((res) => {
    storeName.value = res.storeName
    storeCover.value = res.storeImageUrl
  })
}

function handleReceive() {
  receiveCoupon(props.coupon.couponGroupId).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        message: "领取成功！",
        type: 'success',
        center: true,
      })
      emit("receiveFinished", true)
    } else if (res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}
</script>

<template>
  <el-card class="coupon-card">
    <el-row justify="space-between" style="height: 180px">
      <el-col :span="18">
        <div class="left">
          <el-tag class="coupon-type-tag" size="large">{{ couponStateText }}</el-tag>
          <el-text v-if="coupon.couponGroupCategory === 'FullReduction'"
                   class="coupon-note">
            {{ getCouponNote(coupon) }}
          </el-text>
          <el-popover
              v-else
              placement="right"
              trigger="click"
              width="400px"
              title="蓝鲸券使用规则"
              :content="getCouponNote(coupon)">
            <template #reference>
              <el-text class="coupon-note">
                <el-icon>
                  <warning/>
                </el-icon>
                点击查看蓝鲸券使用规则
              </el-text>
            </template>
          </el-popover>
          <div v-if="role === 'CUSTOMER'">
            <el-text v-if="props.coupon.couponGroupSpace === 'StoreOnly'"
                     class="coupon-info">适用店铺：{{ storeName }}&emsp;
            </el-text>
            <el-text v-if="!props.isGroup"
                     class="coupon-info">
              {{ timeMap(props.coupon.expiredTime) }}前有效
            </el-text>
          </div>
          <div v-if="role === 'CEO' || role === 'STAFF'">
            <el-text class="coupon-info">已领取：{{ props.coupon.couponGroupReceiveNum }}</el-text>
            <el-text class="coupon-info">&emsp;未领取：{{ props.coupon.couponGroupRemains }}</el-text>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="right">
          <el-image :src="storeCover" v-if="props.coupon.couponGroupSpace === 'StoreOnly'"></el-image>
          <el-text v-if="props.coupon.couponGroupSpace === 'GlobalCoupon'"
                   class="coupon-info">所有店铺可用
          </el-text>
          <el-button
              v-if="role === 'CUSTOMER' && props.isGroup"
              @click="handleReceive"
              class="receive-button">
            点击领取
          </el-button>
          <el-tag
              v-if="role === 'CUSTOMER' && !props.isGroup"
              style="order: -1"
              :type="couponStateMap(props.coupon.state).type">
            {{ couponStateMap(props.coupon.state).text }}
          </el-tag>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped>
.coupon-card {
  background: aliceblue;
}

.left {
  padding-left: 15px;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: flex-start;
}

.coupon-type-tag {
  background: skyblue;
  color: white;
  font-size: 95%;
}

.coupon-note {
  align-self: flex-start;
  color: skyblue;
  font-size: 100%;
}

.coupon-info {
  align-self: flex-start;
  color: skyblue;
  font-size: 80%;
}

.right {
  height: 100%;
  display: flex;
  flex-flow: column-reverse;
  justify-content: space-between;
}

.receive-button {
  background: skyblue;
  color: white;
  font-size: 70%;
  order: -1;
}

</style>