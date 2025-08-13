import { createRouter, createWebHashHistory } from 'vue-router'

import home from '@/pages/home'
import login from '@/pages/login/login'
import mainpage from '@/components/mainPage'

import globallist from '@/pages/main/globallist'
import feedbacklist from '@/pages/main/feedbacklist'
import notelist from '@/pages/main/notelist'
import shoplist from '@/pages/main/shoplist'
import userlist from '@/pages/main/userlist'

const routes = [
	{
		path: '/',
		component: login
	},{
		path: '/login',
		component: login
	},
	{
		path: '/mainpage',
		component: mainpage,
		name: '',
		children: [{
			path: '',
			component: home,
		},{
			path: '/home',
			component: home,
		},{
			path: '/globallist',
			component: globallist,
			meta: ['环境变量列表'],
		},{
			path: '/feedbacklist',
			component: feedbacklist,
			meta: ['用户反馈列表'],
		},{
			path: '/notelist',
			component: notelist,
			meta: ['用户反馈列表'],
		},{
			path: '/shoplist',
			component: shoplist,
			meta: ['用户反馈列表'],
		},{
			path: '/userlist',
			component: userlist,
			meta: ['用户反馈列表'],
		}
	]},

]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
