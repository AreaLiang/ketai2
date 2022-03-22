import VueRouter from "vue-router"

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes: [{
			path: '/',
			redirect: '/Home'
		},
		{
			name: 'Login',
			path: '/Login',
			meta:{title:'业务大厅登录'},
			component: () => import('@/views/Login')
		},
		,
		{
			name: 'Home',
			path: '/Home',
			meta:{title:'业务大厅'},
			component: () => import('@/views/HomePage')
		}
	]
})

export default router