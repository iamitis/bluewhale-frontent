<script setup lang="ts">
import {router} from '../router'
import {parseRole} from "../utils"
import {Goods, List, Money, User, SwitchButton} from "@element-plus/icons-vue"   //图标

const role = sessionStorage.getItem('role')    //登录的时候插入的

//退出登录
function logout() {
  ElMessageBox.confirm(
      '是否要退出登录？',
      '提示',
      {
        customClass: "customDialog",
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: "warning",
        showClose: false,
        roundButton: true,
        center: true
      }
  ).then(() => {
    sessionStorage.setItem('token', '')
    router.push({path: "/login"})
  })
}
</script>


<template>
  <el-affix :offset="0">
    <el-header class="custom-header" height="20">
      <el-row :gutter="10">

        <el-col :span="3" class="header-icon">
          <router-link to="/allStore" v-slot="{navigate}" class="no-link">
            <h1 @click="navigate" class="header-text"> 蓝鲸在线购物</h1>
          </router-link>
        </el-col>

        <el-col :span="2">
          <el-tag class="role-tag" size="large">{{ parseRole(role) }}版</el-tag>
        </el-col>

        <el-col :span="14">
        </el-col>

        <el-col :span="1" class="header-icon">
          <router-link to="/allstore" v-slot="{navigate}">
            <el-tooltip effect="light" content="商店">
              <el-icon @click="navigate" :size="35" color="white">
                <Goods/>
              </el-icon>
            </el-tooltip>
          </router-link>
        </el-col>

        <el-col :span="1" class="header-icon">
          <router-link to="/allorder" v-slot="{navigate}">
            <el-tooltip effect="light" content="订单">
              <el-icon @click="navigate" :size="35" color="white">
                <List/>
              </el-icon>
            </el-tooltip>
          </router-link>
        </el-col>

        <el-col :span="1" class="header-icon">
          <router-link to="/allcoupon" v-slot="{navigate}">
            <el-tooltip effect="light" content="优惠券">
              <el-icon @click="navigate" :size="35" color="white">
                <money/>
              </el-icon>
            </el-tooltip>
          </router-link>
        </el-col>

        <el-col :span="1" class="header-icon">
          <router-link to="/dashboard" v-slot="{navigate}">
            <el-tooltip effect="light" content="个人信息">
              <el-icon @click="navigate" :size="35" color="white">
                <User/>
              </el-icon>
            </el-tooltip>
          </router-link>
        </el-col>

        <el-col :span="1" class="header-icon">
          <a @click="logout">
            <el-tooltip effect="light" content="退出登录">
              <el-icon :size="35" color="white">
                <SwitchButton/>
              </el-icon>
            </el-tooltip>
          </a>
        </el-col>
      </el-row>
    </el-header>
  </el-affix>
</template>


<style scoped>
.custom-header {
  background: skyblue;
  /*border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;*/

  display: flex;
  flex-direction: column;
}

.no-link {
  text-decoration: none;
}

.role-tag {
  margin-top: 20px;
  font-size: 20px;
}

.header-text {
  color: white;
  font-size: x-large;
  min-width: max-content;
  margin-top: 15px;
  margin-bottom: 15px;
}

.header-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
