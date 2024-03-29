<!--Lab2新增-创建商店界面-->
<!--你可以选择把创建商店改成一个弹窗或其他界面的一个部分。
这样的话，就不需要有这样一个views下的创建商店文件了，因为views下的文件一般会是一个单独的界面。
但如果你觉得这一个部分的代码较多，合到其他文件里会使那个文件太长，
可以在store文件夹下创建一个components子文件夹，里面存放store模块下产生的组件界面。把这个创建商店子组件放在里面
这个传递数据的过程可能需要用到props-->

<script setup lang="ts">
import {computed, ref} from 'vue'
import {uploadImage} from '../../../api/tools.ts'
import {Plus, InfoFilled, UploadFilled} from "@element-plus/icons-vue"
import {ElFormItem, ElMessage} from "element-plus";
import {router} from "../../../router";
import {createStore} from "../../../api/store.ts";

const dialogFormVisible = ref(false)
const imageFileList = ref([])
const logoUrl = ref('')
const name = ref('')
const description = ref('')

const hasName = computed(() => name.value != '')
const hasDescription = computed(() => description.value != '')
const hasImage = computed(() => imageFileList.value.length > 0)
// 创建按钮可用性
const createDisabled = computed(() => {
  return !(hasName.value && hasDescription.value && hasImage.value)
})

function handleChange(file: any, fileList: any) {
  imageFileList.value = fileList
  let formData = new FormData()
  formData.append('file', file.raw)
  uploadImage(formData).then(res => {
    logoUrl.value = res.data.result
  })
}

function handleExceed() {
  ElMessage.warning(`当前限制选择 1 个文件`);
}

function uploadHttpRequest() {
  return new XMLHttpRequest()
}

function confirmCreate() {
  ElMessageBox.confirm(
      '确定要创建此新商店吗？',
      {
        confirmButtonText: '确定',
        cancelButtonText: '还没想好',
        center: true,
      }
  ).then(() => {
    handleCreate()
    ElMessage({
      type: 'success',
      message: '正在创建商店',
    })
  })
}

function handleCreate() {
  createStore({
    storeName: name.value,
    category: description.value
  }).then(res => {
    if (res.data.code === '000') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
      ElMessage({
        message: "创建商店成功！",
        type: 'success',
        center: true,
      })
      router.push({path: "/allstore"})
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
      创建商店
    </el-button>
  </div>

  <el-dialog
      v-model="dialogFormVisible"
      width="20%"
      draggable
      title="创建一个新的商店">
    <el-form
        label-position="top">

      <el-form-item label="商店名称">
        <el-input
            v-model="name"
            maxlength="20"
            show-word-limit
            clearable
            placeholder="请输入商店名称"/>
      </el-form-item>

      <el-form-item label="商店描述">
        <el-input
            v-model="description"
            type="textarea"
            maxlength="30"
            show-word-limit
            clearable
            :prefix-icon="InfoFilled"
            placeholder="简要介绍商店"/>
      </el-form-item>

      <el-form-item label="商店Logo">
        <el-upload
            v-model:file-list="imageFileList"
            :limit="1"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :on-remove="handleChange"
            class="upload-demo"
            list-type="picture"
            :http-request="uploadHttpRequest"
            drag>
          <el-icon class="el-icon--upload">
            <UploadFilled/>
          </el-icon>
          <div class="el-upload__text">
            将图片拖到此处或<em>单击此处上传</em><br>仅允许上传一张图片
          </div>
        </el-upload>
      </el-form-item>

      <span class="create-button">
        <el-button
            @click="confirmCreate"
            :disabled="createDisabled"
            type="primary">
          创建
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
