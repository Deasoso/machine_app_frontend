<template>
	<div class="header_container">
		<i class="el-icon-s-fold" @click="clickMenuChange"></i>
		<div style="margin-left:16px;">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/mainpage' }">青圭校园</el-breadcrumb-item>
				<el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="top-icon-position">
			<el-popover
				placement="bottom-end"
				trigger="hover">
				<div class="top-icon-tip-text">占位</div>
				<el-badge slot="reference" :value="12" class="mark">
					<i class="el-icon-message-solid top-icon-style"></i>
				</el-badge>
			</el-popover>
		</div>
		<div class="top-login-position">
			<!-- <el-avatar :size="44" :src="useravatar"></el-avatar>
			<el-dropdown trigger="click" class="top-name-style">
				<span class="el-dropdown-link">
					{{username}}<i class="el-icon-arrow-down el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown" >
					<el-dropdown-item icon="el-icon-user" @click.native="userProfile">我的信息</el-dropdown-item>
					<el-dropdown-item icon="el-icon-question">操作指南</el-dropdown-item>
					<el-dropdown-item icon="el-icon-error" @click.native="logout">退出系统</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown> -->
			<el-avatar :size="44" :src="useravatar"></el-avatar>
			<el-dropdown class="top-name-style">
				<span class="el-dropdown-link">
					{{ username }}
					<el-icon class="el-icon--right">
						<arrow-down />
					</el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<!-- <el-dropdown-item v-if="!logined" @click="openlogin">登录</el-dropdown-item> -->
						<!-- <el-dropdown-item v-if="!logined" @click="openregister">注册</el-dropdown-item> -->
						<!-- <el-dropdown-item v-if="logined" @click="tomine">个人中心</el-dropdown-item> -->
						<el-dropdown-item @click="gohome">首页</el-dropdown-item>
						<el-dropdown-item @click="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
export default {
	data(){
		return {
			username: '管理员',
		}
	},
	methods: {
		clickMenuChange(){
			this.$emit('changeMenuWidth'); // 由于是在elementui组件里，必须用$emit
		},
		gohome(){
			this.$router.push('/home')
		},
		logout(){
			localStorage.removeItem("xiaoyuan_superadmin_userInfo");
			this.$router.replace('/login')
		}
	}
}
</script>

<style scoped>
.header_container{
	background-color: #505559;
	height: 52px !important;
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	padding-left: 20px;
}
.avator{
	width: 36px;
	height: 36px;
	border-radius: 50%;
	margin-right: 37px;
}
.top-name-style{
	color: #ffffff;
	overflow: hidden;
	margin-top: 14px;
	margin-left: 12px;
	font-weight: bold;
}
.top-icon-style{
	font-size: 24px;
	color: #ffffff;
	overflow: hidden;
}
.top-icon-position{
	margin-right: 50px;
	margin-top: 10px;
	text-align: right;
	flex: 1;
	visibility: hidden;
}
.top-icon-tip-text{
	margin: 4px 8px;
}
.top-login-position{
	margin-top: 4px;
	margin-right: 32px;
	text-align: right;
}
.header_container /deep/ .el-breadcrumb__inner.is-link{
	color: #ffffff;
}
.header_container /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner{
	color: #ffffff;
}
</style>
