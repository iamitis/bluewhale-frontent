<script setup lang="ts">
import {computed, ref} from "vue";
import {createOrder} from "../../api/order.ts";
import {ElMessage} from "element-plus";
import {router} from "../../router";
import {addAddress, addPhone, getAllAddresses, getAllPhones} from "../../api/user.ts";

const props = defineProps({
  productId: Number,
  productName: String,
  productSales: Number,
  productPrice: Number,
  productStoreId: Number,
})
const emit = defineEmits(['createOrderFinished'])
const userId = Number(sessionStorage.getItem('userId'))
const count = ref(1)
const totalPrice = computed(() => props.productPrice * count.value)
const pickup = ref('')
const address = ref('')
const consigneeName = ref('')
const consigneePhone = ref('')
const hasPickup = computed(() => pickup.value !== '')
const hasPhone = computed(() => consigneePhone.value !== '')
const hasAddress = computed(() => address.value !== '')
const hasConsigneeName = computed(() => consigneeName.value !== '')
const orderId = ref(-1)
const phoneNumberList = ref<Array<string>>([])
const addressList = ref<Array<string>>([])
const isAddingPhone = ref<boolean>(false)
const isAddingAddress = ref<boolean>(false)
const newPhone = ref<string>('')
const newAddress = ref<string>('')
// 电话号码的规则
const chinaMobileRegex = /^1(3[0-9]|4[579]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[189])\d{8}$/
const newPhoneLegal = computed(() => chinaMobileRegex.test(newPhone.value))

getAllPhones().then((res: Array<string>) => {
  phoneNumberList.value = res
  const defaultPhone = sessionStorage.getItem('defaultPhone')
  if (defaultPhone != '') {
    consigneePhone.value = defaultPhone
  }
})
getAllAddresses().then((res: Array<string>) => {
  addressList.value = res
  const defaultAddress = sessionStorage.getItem('defaultAddress')
  if (defaultAddress != '') {
    address.value = defaultAddress
  }
})

function checkForm() {
  if (!hasPickup.value) {
    ElMessage.warning('请选择取货方式')
    return false
  } else if (pickup.value === 'DELIVERY' && !hasAddress.value) {
    ElMessage.warning('请选择收货地址')
    return false
  } else if (!hasConsigneeName.value) {
    ElMessage.warning('请填写收件人姓名')
  } else if (!hasPhone.value) {
    ElMessage.warning('请选择收件人电话号码')
  } else {
    handleCreate()
  }
}

function addNewPhone() {
  if (!newPhoneLegal.value) {
    ElMessage.warning('请填写正确的电话号码')
  } else {
    addPhone(newPhone.value).then((res:any) => {
      if (res.data.code === '000') {
        phoneNumberList.value.push(newPhone.value)
        consigneePhone.value = newPhone.value
        cancelNewPhone()
      } else {
        ElMessage.warning('错误！')
      }
    })
  }
}

function cancelNewPhone() {
  isAddingPhone.value = false
  newPhone.value = ''
}

function addNewAddress() {
  if (newAddress.value === '') {
    ElMessage.warning('请填写新地址')
  } else {
    addAddress(newAddress.value).then((res:any) => {
      if (res.data.code === '000') {
        addressList.value.push(newAddress.value)
        address.value = newAddress.value
        cancelNewAddress()
      } else {
        ElMessage.warning('错误！')
      }
    })
  }
}

function cancelNewAddress() {
  isAddingAddress.value = false
  newAddress.value = ''
}

function handleCreate() {
  createOrder({
    invoiceProductId: props.productId,
    invoiceProductNum: count.value,
    invoicePrice: totalPrice.value,
    invoiceStoreId: props.productStoreId,
    invoiceUserId: userId,
    getProducts: pickup.value,
    invoiceAddress: pickup.value === 'DELIVERY' ? address.value : '',
    invoiceName: consigneeName.value,
    invoicePhone: consigneePhone.value,
  }).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        message: "下单成功！",
        type: 'success',
        center: true,
      })
      orderId.value = res.data.result
      ElMessageBox.confirm(
          '现在去支付？',
          {
            confirmButtonText: '去支付',
            cancelButtonText: '稍后支付',
            center: true,
          }
      ).then(() => {
        router.push(`/orderdetail/${orderId.value}`)
      }).catch(() => {
        emit("createOrderFinished", true)
      })
    }
  })
}
</script>

<template>
  <el-form
      class="order-form"
      label-position="left">
    <el-form-item label="购买数量">
      <el-input-number
          v-model="count"
          :min="1"
          :max="props.productSales"/>
    </el-form-item>
    <el-form-item label="取货方式">
      <el-radio v-model="pickup" label="DELIVERY" size="large">快递送达</el-radio>
      <el-radio v-model="pickup" label="PICKUP" size="large">到店自提</el-radio>
    </el-form-item>
    <el-form-item v-if="pickup === 'DELIVERY'" label="收货地址">
      <el-select
          v-model="address"
          placeholder=" "
          clearable>
        <el-option
            v-for="addr in addressList"
            :value="addr"/>
        <template #footer>
          <el-button
              v-if="!isAddingAddress" text bg size="small" @click="isAddingAddress = true">
            新增收货地址
          </el-button>
          <template v-else>
            <el-input v-model="newAddress" placeholder="输入新增收货地址" style="margin-bottom: 1em"/>
            <el-button size="small" @click="addNewAddress">确定</el-button>
            <el-button size="small" @click="cancelNewAddress">取消</el-button>
          </template>
        </template>
      </el-select>
    </el-form-item>
    <el-form-item label="收件人电话">
      <el-select
          v-model="consigneePhone"
          placeholder=" "
          clearable>
        <el-option
            v-for="phone in phoneNumberList"
            :value="phone"/>
        <template #footer>
          <el-button
              v-if="!isAddingPhone" text bg size="small" @click="isAddingPhone = true">
            添加收件人电话
          </el-button>
          <template v-else>
            <el-input v-model="newPhone" placeholder="输入新增电话号码" style="margin-bottom: 1em"/>
            <el-button size="small" @click="addNewPhone">确定</el-button>
            <el-button size="small" @click="cancelNewPhone">取消</el-button>
          </template>
        </template>
      </el-select>
    </el-form-item>
    <el-form-item label="收件人姓名">
      <el-input
          v-model="consigneeName"
          maxlength="15"
          show-word-limit
          clearable/>
    </el-form-item>
    <span>总价 : ￥{{ count * productPrice }}</span>
    <span class="create-button-box">
        <el-button
            class="create-button"
            @click="checkForm"
            color="lightpink">
          下单
        </el-button>
      </span>
  </el-form>
</template>

<style scoped>
.create-button-box {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  justify-content: right;
}

.create-button {
  color: steelblue;
}
</style>