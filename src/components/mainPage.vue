<template>
	<div class="fillcontain">
    <el-container class="fullheight">
      <el-aside width=null>
        <left-menu ref="leftMenu"></left-menu>
      </el-aside>
      <el-container>
        <el-header style="padding: 0;height: 56px;">
          <head-menu @changeMenuWidth="changeMenuWidth"></head-menu>
        </el-header>
        <el-main style="padding: 0">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import headMenu from "@/components/headMenu";
import leftMenu from "@/components/leftMenu";

export default {
	data() {
		return {
			isCollapse: false,
		}
  },
  components: { // component给template的命名规则：大写转横杠+小写
    headMenu,
    leftMenu
  },
  methods: {
    changeMenuWidth() {
      this.$refs.leftMenu.changeWidth();
    }
  }
};
</script>


<style scoped>
.fullheight{
  min-height: 100vh;
}
</style>
