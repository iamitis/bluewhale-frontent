<script setup lang="ts">
import {reactive, ref} from "vue";
import {updateProductSales} from "../../api/product.ts";
import {ElMessage, FormInstance, FormRules} from "element-plus";

const dialogFormVisible = ref(false)
const props = defineProps({
  productId: Number
})

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  sales: ''
})

const rules = reactive<FormRules<RuleForm>>({
  sales: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请填写添加数量'))
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('需为整数'))
          } else if (value < 1) {
            callback(new Error('数量需大于0'))
          } else {
            callback()
          }
        })
      }
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
      '确定要添加库存吗？',
      {
        confirmButtonText: '确定',
        cancelButtonText: '还没想好',
        center: true,
      }
  ).then(() => {
    handleUpdate()
    ElMessage({
      type: 'success',
      message: '正在更新库存',
    })
  })
}

function handleUpdate() {
  updateProductSales(
      {
        product_id: props.productId,
        sales: ruleForm.sales
      })
      .then(res => {
        if (res.data.code === '000') {
          ElMessage({
            message: "更新库存成功！",
            type: 'success',
            center: true,
          })
          window.location.reload()
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
        text>
      添加库存
    </el-button>
  </div>

  <el-dialog
      v-model="dialogFormVisible"
      width="20%"
      draggable
      title="更新商品库存">

    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        status-icon
        label-position="top">

      <el-form-item label="添加数量" prop="sales">
        <el-input
            v-model.number="ruleForm.sales"/>
      </el-form-item>


      <span class="create-button">
        <el-button
            @click="submitForm(ruleFormRef)"
            type="primary">
          添加
        </el-button>
      </span>


    </el-form>
  </el-dialog>
</template>

<style scoped>

.create-button {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  justify-content: right;
}
</style>