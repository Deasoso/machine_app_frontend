import { createRouter, createWebHashHistory } from 'vue-router'

import home from '@/pages/home'
import mainpage from '@/components/mainPage'

const routes = [
	{
		path: '/',
		component: mainpage,
		name: '',
	}
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
