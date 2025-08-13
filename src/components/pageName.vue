<template>
  <div class="waitingtext">
    <!-- <el-page-header @back="goBack" :content="pageName">
    </el-page-header> -->
    <div class="el-page-header">
      <div v-if="!noBack" class="el-page-header__left" @click="goBack()">
        <i class="el-icon-back"></i>
        <div class="el-page-header__title">
          <slot name="title">{{ title || "返回" }}</slot>
        </div>
      </div>
      <div class="el-page-header__content" :style="{'margin-left': noBack ? '10px' : '0px'}">
        <slot name="content">{{ pageName }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  props:['title', 'pageName', 'noBack'],
  methods: {
    goBack(){
      console.log('goback');
      this.$router.go(-1)
    }
  }
};
</script>

<style scoped>
.waitingtext{
  //border-color: #d1e2f7;
  border: solid 1px #e6e6e6;
  //border-style: solid;
  //border-width: 1px;
  padding: 20px;
  color: #3a62d7;
}
</style>
