<script setup lang="ts">
import {addCoupon, getAllCoupon, getRealPrice, OrderPayInfo, payOrder} from "../../api/order.ts";
import {Check, Pointer, Warning} from "@element-plus/icons-vue"
import {ElMessage} from "element-plus";
import {computed, ref} from "vue";
import {couponCategoryMap, getCouponNote, timeMap} from "../../api/coupon.ts";
import {notify} from "../../api/alipay.ts";

const props = defineProps({
  orderId: Number,
  totalPrice: Number,
})
const emit = defineEmits(['payFinished'])
const couponList = ref([])
const chosenCoupon = ref<any>()
const chosenIndex = ref<number>(-1)
const couponTableVisible = ref(false)
const realPrice = ref<number>(props.totalPrice)
const couponNum = computed(() => {
  if (couponList.value != null) {
    return couponList.value.length
  } else {
    return 0
  }
})
const tableData = ref<TableRow[]>([])
let cutDown = new Map<number, number>()

interface TableRow {
  couponId: number,
  couponCategory: string,
  couponExpiredTime: string,
  couponNote: string,
  cutDown: number,
}

getCouponList().then(() => {
  if (couponNum.value > 0) {
    tableData.value = couponList.value.map((coupon: any) => {
      return {
        couponId: coupon.couponId,
        couponCategory: coupon.couponCategory,
        couponExpiredTime: coupon.couponExpireTime,
        couponNote: getCouponNote(coupon),
        cutDown: parseFloat((props.totalPrice - cutDown.get(coupon.couponId)).toFixed(2))
      }
    })
  }
})

function lookupCoupon() {
  couponTableVisible.value = !couponTableVisible.value
  chosenCoupon.value = null
  chosenIndex.value = -1
  realPrice.value = props.totalPrice
}

function getCouponList() {
  return getAllCoupon(props.orderId).then(res => {
    couponList.value = res
    return res
  }).then(() => {
    if (couponNum.value > 0) {
      const promise = couponList.value.map((coupon) => {
        return getRealPrice(props.orderId, coupon.couponId)
            .then((res) => {
              cutDown.set(coupon.couponId, res)
              return res
            })
      })
      return Promise.all(promise)
    }
    return 0
  })
}

function handleChosen(index: number, couponRow: any) {
  if (chosenIndex.value === index) {
    chosenIndex.value = -1
    chosenCoupon.value = null
    realPrice.value = props.totalPrice
  } else {
    chosenIndex.value = index
    chosenCoupon.value = couponRow
    getRealPrice(props.orderId, chosenCoupon.value.couponId)
        .then((res: number) => {
          realPrice.value = parseFloat(res.toFixed(2))
        })
  }
}

function confirmPay() {
  ElMessageBox.confirm(
      '确定支付此订单吗？',
      {
        confirmButtonText: '确定',
        cancelButtonText: '还没想好',
        center: true,
      }
  ).then(() => {
    handlePay()
  })
}

function handlePay() {
  const orderPayInfo: OrderPayInfo = {}
  orderPayInfo.invoiceId = Number(props.orderId)
  orderPayInfo.couponId = chosenCoupon.value == null ? null : chosenCoupon.value.couponId
  if (orderPayInfo.couponId != null) {
    addCoupon(orderPayInfo).then(() => {
      payOrder(orderPayInfo).then(res => {
        const div = document.createElement('div');
        div.id = 'payDiv'
        div.innerHTML = res.data.result
        document.body.appendChild(div)
        document.getElementById('payDiv').getElementsByTagName('form')[0].submit()
      })
    })
  } else {
    payOrder(orderPayInfo).then(res => {
      const div = document.createElement('div');
      div.id = 'payDiv'
      div.innerHTML = res.data.result
      document.body.appendChild(div)
      document.getElementById('payDiv').getElementsByTagName('form')[0].submit()
    })
  }
}
</script>

<template>
  <div class="pay-box">
    <el-button
        v-if="couponNum > 0"
        @click="lookupCoupon"
        color="skyblue"
        style="color: white; align-self: flex-start">
      可使用优惠券
      <el-icon class="el-icon--right">
        <pointer/>
      </el-icon>
    </el-button>
    <div v-if="couponNum <= 0"
         style="align-self: flex-start; display: flex; align-items: center; gap: 10px">
      <el-tag
          size="large"
          style="background: skyblue; color: white; align-self: flex-start; font-size: 100%">
        无可用优惠券
      </el-tag>
      <router-link to="/allcoupon" v-slot="{navigate}" style="text-decoration: none">
        <el-text style="color: skyblue">
          去领券
        </el-text>
      </router-link>
    </div>

    <el-table
        v-if="couponTableVisible"
        :data="tableData"
        :default-sort="{prop: 'cutDown', order: 'descending'}"
        max-height="250"
        style="width: 100%">
      <el-table-column label="优惠券类型">
        <template #default="scope">
          <el-popover trigger="click" placement="top" width="auto">
            <template #default>
              <el-text type="info">{{ scope.row.couponNote }}</el-text>
            </template>
            <template #reference>
              <div style="display: flex; align-items: center">
                <el-tag>{{ couponCategoryMap(scope.row.couponCategory) }}</el-tag>
                <el-icon style="margin-left: 2px">
                  <warning/>
                </el-icon>
              </div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="cutDown" sortable label="可省">
        <template #default="scope">
          <el-text>可省{{ scope.row.cutDown }}元</el-text>
        </template>
      </el-table-column>
      <el-table-column prop="couponExpiredTime" sortable label="使用期限">
        <template #default="scope">
          <el-text>{{ timeMap(scope.row.couponExpiredTime) }}之前</el-text>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
          <div style="display: flex; align-items: center; gap: 10px">
            <el-button
                @click="handleChosen(scope.$index, scope.row)"
                style="background: skyblue; color: white">
              使用
            </el-button>
            <el-icon v-if="chosenIndex === scope.$index">
              <check/>
            </el-icon>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="width: 100%; display: flex; justify-content: space-between; margin-top: 10px">
      <el-text>
        <el-tag size="large" style="background: skyblue; color: white; font-size: 100%">
          总价：{{ props.totalPrice }}元
        </el-tag>
        <el-tag size="large" style="background: skyblue; color: white; font-size: 100%; margin-left: 10px">
          应付：{{ realPrice }}元
        </el-tag>
      </el-text>
      <el-button
          @click="confirmPay"
          color="lightpink"
          style="color: white">
        付款
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.pay-box {
  display: flex;
  display: -webkit-flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 480px;
}
</style>