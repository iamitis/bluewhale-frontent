<!--Lab2新增-创建商品界面-->
<!--你可以选择把创建商品改成一个弹窗或其他界面的一个部分。
这样的话，就不需要有这样一个views下的创建商品文件了，因为views下的文件一般会是一个单独的界面。
但如果你觉得这一个部分的代码较多，合到其他文件里会使那个文件太长，
可以在product文件夹下创建一个components子文件夹，里面存放product模块下产生的组件界面。把这个创建商品子组件放在里面。
这个传递数据的过程可能需要用到props-->

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {uploadImage} from '../../api/tools.ts'
import {Plus} from "@element-plus/icons-vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {router} from "../../router";
import {createProduct} from "../../api/product.ts";

const dialogFormVisible = ref(false)
const typeList = ref([
  'FOOD', 'CLOTHES', 'FURNITURE', 'ELECTRONICS', 'ENTERTAINMENT', 'SPORTS', 'LUXURY'
])
const storeId = sessionStorage.getItem('storeId')
const imageFileList = ref([])
const imageUrl = ref([])

interface RuleForm {
  name: string
  type: string
  price: number
  description: string
  imageFileList: FileList[]
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: '',
  type: '',
  price: -1,
  description: '',
  imageFileList: []
})

const rules = reactive<FormRules<RuleForm>>({
  name: [
    {
      required: true,
      message: '请填写商品名称',
      trigger: 'blur'
    },
  ],
  type: [
    {
      required: true,
      message: '请选择商品类型',
      trigger: 'change',
    },
  ],
  price: [
    {
      required: true,
      message: '请填写商品价格',
      trigger: 'blur'
    },
    {
      type: 'number',
      message: '需为数字'
    }
  ],
  description: [
    {
      required: true,
      message: '请简要描述商品',
      trigger: 'blur'
    },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      confirmCreate()
    }
  })
}

function handleChange(file: any, fileList: any) {
  imageFileList.value = fileList
  let formData = new FormData()
  formData.append('file', file.raw)
  console.log(formData.get('file'))
  uploadImage(file.raw).then(res => {
    imageUrl.value = res.data.result
  })
}

function handleRemove() {
  // TODO
}


function handleExceed() {
  ElMessage.warning(`当前限制至少选择两个文件`)
}

function uploadHttpRequest() {
  return new XMLHttpRequest()
}

function confirmCreate() {
  ElMessageBox.confirm(
      '确定要新建此商品吗？',
      {
        confirmButtonText: '确定',
        cancelButtonText: '还没想好',
        center: true,
      }
  ).then(() => {
    handleCreate()
    ElMessage({
      type: 'success',
      message: '正在创建商品',
    })
  })
}

function handleCreate() {
  createProduct({
    productName: ruleForm.name,
    productCategory: ruleForm.type
  }).then(res => {
    if (res.data.code === '000') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
      ElMessage({
        message: "创建商品成功！",
        type: 'success',
        center: true,
      })
      router.push({path: `/storeDetail/${storeId}`})
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

  <div class="add-button">
    <el-button
        @click="dialogFormVisible = true"
        type="primary"
        round
        :icon="Plus">
      新建商品
    </el-button>
  </div>

  <el-dialog
      v-model="dialogFormVisible"
      width="20%"
      draggable
      title="新建一种商品">

    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        status-icon
        label-position="top">

      <el-form-item label="商品名称" prop="name">
        <el-input
            v-model="ruleForm.name"
            maxlength="20"
            show-word-limit
            clearable/>
      </el-form-item>

      <el-form-item label="商品种类" prop="type">
        <el-select
            v-model="ruleForm.type"
            style="width: 100%">
          <el-option
              v-for="type in typeList"
              :key="type"
              :value="type"/>
        </el-select>
      </el-form-item>

      <el-form-item label="商品价格" prop="price">
        <el-input
            v-model.number="ruleForm.price"/>
      </el-form-item>

      <el-form-item label="商品描述" prop="description">
        <el-input
            v-model="ruleForm.description"
            type="textarea"
            maxlength="30"
            show-word-limit
            clearable/>
      </el-form-item>

      <el-form-item label="商品图片">
        <el-upload
            v-model:file-list="imageFileList"
            class="upload-demo"
            list-type="picture"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :http-request="uploadHttpRequest"
            drag>
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            将图片拖到此处或<em>单击此处上传</em><br>
            至少上传两张图片
          </div>
        </el-upload>
      </el-form-item>

      <span class="create-button">
        <el-button
            @click="submitForm(ruleFormRef)"
            type="primary">
          新建
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
