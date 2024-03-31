<script setup lang="ts">
import {reactive, ref} from "vue";
import {updateProductSales} from "../api/product.ts";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {router} from "../router";
import {Plus} from "@element-plus/icons-vue";


const dialogFormVisible = ref(false)
const productId = parseInt(sessionStorage.getItem('productId') as string, 10)


interface RuleForm {
  sales: number
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  sales: -1
})

const rules = reactive<FormRules<RuleForm>>({
  sales: [
    {
      required: true,
      message: '请填写更新后商品数量',
      trigger: 'blur'
    },
    {
      type: 'number',
      message: '需为数字'
    }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      confirmUpdate()
    }
  })
}


function confirmUpdate() {
  ElMessageBox.confirm(
      '确定要更新商品吗？',
      {
        confirmButtonText: '确定',
        cancelButtonText: '还没想好',
        center: true,
      }
  ).then(() => {
    handleUpdate()
    ElMessage({
      type: 'success',
      message: '正在创建商品',
    })
  })
}

function handleUpdate() {
  updateProductSales(productId, ruleForm.sales)
      .then(res => {
        if (res.data.code === '000') {
          ElMessage({
            message: "创建商品成功！",
            type: 'success',
            center: true,
          })
          router.push({path: `/productDetail/${productId}`})
        } else if (res.data.code == '400') {
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

  <div class="add-button">
    <el-button
        @click="dialogFormVisible = true"
        type="primary"
        round
        :icon="Plus">
      更新商品数量
    </el-button>
  </div>

  <el-dialog
      v-model="dialogFormVisible"
      width="20%"
      draggable
      title="更新商品数量">

    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        status-icon
        label-position="top">

      <el-form-item label="商品数量" prop="sales">
        <el-input
            v-model.number="ruleForm.sales"/>
      </el-form-item>


      <span class="create-button">
        <el-button
            @click="submitForm(ruleFormRef)"
            type="primary">
          更新
        </el-button>
      </span>


    </el-form>
  </el-dialog>
</template>

<style scoped>

.add-button {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  justify-content: center;
}

.create-button {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  justify-content: right;
}
</style>