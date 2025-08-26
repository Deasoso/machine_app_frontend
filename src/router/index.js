import { createRouter, createWebHashHistory } from 'vue-router'

import home from '@/pages/home'

const routes = [
	{
		path: '/',
		component: home,
		name: '',
	}
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
