<template>
  <div class="pageborder">
    <div class="pageback">
      <envir-page-name style="background-color: #ffffff;" :noBack="true" pageName="首页" />
      <div class="pageinpadding">
        <div style="margin-left: 16px;">欢迎来到青圭校园系统管理前端！</div>
        <!-- <div class="search">
          <el-row>
            <el-col :span="12">
              <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" class="newclue" @click="toStartProcess">发布线索</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="overview">
          <el-row>
            <el-col :span="6">
              <div class="numtext">100</div>
              <div class="nametext">线索容量</div>
            </el-col>
            <el-col :span="6">
              <div class="numtext">10</div>
              <div class="nametext">在办线索</div>
            </el-col>
            <el-col :span="6">
              <div class="numtext">100</div>
              <div class="nametext">线索容量</div>
            </el-col>
            <el-col :span="6">
              <div class="numtext">100</div>
              <div class="nametext">线索容量</div>
            </el-col>
          </el-row>
          <el-row :gutter="40" style="height: 0;">
            <el-col :span="6" :offset="3">
              <el-divider class="dividers" direction="vertical"></el-divider>
            </el-col>
            <el-col :span="6">
              <el-divider class="dividers" direction="vertical"></el-divider>
            </el-col>
            <el-col :span="6">
              <el-divider class="dividers" direction="vertical"></el-divider>
            </el-col>
          </el-row>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      allvalue: 0,
      nowithdraw: 0,
      value1: ''
    };
  },
  mounted() {

  },
  methods: {
    async getAllValue() {

    },
    toStartProcess() {
      this.$router.push("/startProcess");
    }
  }
};
</script>

<style scoped>
.cards{
  text-align: center;
  margin: 10px;
  margin-top: 20px;
}
.search{
  margin: 10px;
  margin-bottom: 20px;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 350px;
}
.newclue{
  float: right;
  padding-left: 60px;
  padding-right: 60px;
}
</style>
