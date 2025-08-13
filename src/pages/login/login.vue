<template>
	<div class="loginback" :style="'background: url(\'https://www.hnie.edu.cn/__local/B/C7/35/2FADD5D1C08C5B746540CD675F1_FA1037AA_A508F.jpg\');background-size: cover;'">
		<div class="loginwindow">
			<div class="rightback" v-loading="loading">
				<div class="welcometext">
					欢迎登录青圭校园系统后台
				</div>
				<el-input placeholder="请输入账号" v-model="username" class="idinput">
					<i style="color:#3a62d7;" slot="prepend" class="el-icon-user-solid"></i>
				</el-input>
				<el-input placeholder="请输入密码" v-model="password" class="pwinput" :show-password="true">
					<i style="color:#3a62d7;" slot="prepend" class="el-icon-lock"></i>
				</el-input>
				<el-button type="primary" class="loginbutton" @click="login">登录</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import api from '@/api';
const CryptoJS = require('crypto-js')

export default {
	data(){
		return{
			username: '',
			password: '',
			code: '',
			checked: false,
			loading: false
		}
  },
  props:['name'],
	methods:{
		async login(){
			this.loading = true;
			var userinfo;
			try{
				userinfo = await api.login("/loginadmin", {
					username: this.username,
					password: CryptoJS.SHA1(this.password + 'school_pw').toString(),
					logintype: 3
				});
				console.log(userinfo);
				// console.info(JSON.stringify(userinfo.data).replace(/,/g, ",\n")) // 转成json，方便复制
				localStorage.removeItem("xiaoyuan_superadmin_userInfo");
				localStorage.setItem('xiaoyuan_superadmin_userInfo', userinfo.token);
				this.$message.success('登录成功');
				this.$router.push('/globallist');
				this.loading = false;
			}catch(e){
				console.error(e);
				this.$message.error('登录失败');
				this.loading = false;
			}
		}
	}
};
</script>


<style scoped>
.loginback{
	min-width: 100vw;
	min-height: 100vh;
}
.loginwindow{
	position: absolute;
	width: 480px;
	height: 320px;
	top: 50%;
	left: 50%;
	margin-left: -240px;
	margin-top: -160px;
	overflow: hidden;
}
.rightback{
	position: absolute;
	width: 480px;
	height: 320px;
	background-color: white;
}
.welcometext{
	text-align: center;
	margin-top: 40px;
	margin-bottom: 40px;
	font-size: 22px;
}
.idinput{
	margin-left: 60px;
	width: 360px;
}
.pwinput{
	margin-top: 16px;
	margin-left: 60px;
	width: 360px;
}
.loginbutton{
	margin-top: 20px;
	width: 360px;
	margin-left: 60px;
}
</style>
