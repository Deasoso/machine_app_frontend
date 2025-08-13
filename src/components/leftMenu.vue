<template>
	<div class="leftmenuback">
		<el-menu 
			router 
			:collapse="isCollapse"
			class="el-menu-vertical-demo"
			background-color="#505559"
			text-color="#fff"
			active-text-color="">
			<el-menu-item class="menu_ajgl_border">
				<!-- <img slot="title" class="logopic" :src="Global.imageUrl + '/xjlogo.png'"/> -->
				<span style="margin-left: 32px;">青圭校园管理系统</span>
			</el-menu-item>
			<div style="min-height: calc(100vh - 56px);">
				<!-- deaso tip: 不想写递归，这里默认地址最多2级 -->
				<div v-for="(item1, index1) in options" :key="index1">
					<!-- dearo tip: 有children，即为一个分栏 -->
					<el-sub-menu v-if="item1.children" :index="item1.name">
						<template #title>
							<i :class="item1.icon" v-if="item1.icon"></i>
							<span slot="title">{{item1.name}}</span>
						</template>
						<!-- dearo tip: 循环获取children，添加菜单项 -->
						<div v-for="(item2, index2) in item1.children" :key="index2">
							<el-menu-item v-if="item2.route" :index="item2.route">
								<i :class="item2.icon" v-if="item2.icon"></i>
								<span slot="title">{{item2.name}}</span>
							</el-menu-item>
						</div>
					</el-sub-menu>
					<!-- dearo tip: 没有children，菜单项，一般为首页 -->
					<el-menu-item v-if="item1.route" :index="item1.route">
						<i :class="item1.icon" v-if="item1.icon"></i>
						<span slot="title">{{item1.name}}</span>
					</el-menu-item>
				</div>
			</div>
		</el-menu>
  </div>
</template>

<script>
import options from './leftMenuOptions.js'

export default {
	data(){
		return{
			isCollapse: false,
			options: options
		}
	},
	methods: {
		changeWidth(){
			this.isCollapse = !this.isCollapse;
		}
	},
	mounted(){
		this.options = options;
	}
};
</script>


<style scoped>
.el-menu-vertical-demo{
	min-height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
	min-width: 200px;
}
.menu_ajgl_border{
	margin-top: -3px;
	border-color: white;
	border-style: solid;
	border-width: 0px 0px 1px 0px;
}
.logopic{
	width: 120px;
	margin-left: 0px;
	margin-right: 20px;
	margin-top: -6px;
}
</style>
