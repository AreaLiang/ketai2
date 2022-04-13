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
			meta: {
				title: '业务大厅登录'
			},
			component: () => import('@/views/Login')
		},
		{
			name: 'Home',
			path: '/Home',
			meta: {
				title: '业务大厅'
			},
			component: () => import('@/views/HomePage'),
			children: [{
					name: 'UserInfo',
					path: 'userinfo',
					meta: {
						headName: ['客户信息', '/', '完善认证信息']
					},
					component: () => import('@/views/userInfo/UserInfo')
				},
				{
					name: 'PdChange',
					path: 'password',
					meta: {
						headName: ['密码更改', '/', ' 密码录入']
					},
					component: () => import('@/views/passwordChange/PdChange')
				},
				{
					name: 'pdfView',
					path: 'serviceList',
					component: () => import('@/views/serviceList/PdfView')
				}
			]
		}
	]
})

// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRouter = [{
	path: '/Home',
	component: () => import('@/views/HomePage'),
	children: [{
		name: 'businessEntrust',
		path: 'businessEntrust',
		meta: {
			isAuthority: "正常",
			headName: ['委托单管理', '/', ' 详细业务']
		},
		component: () => import('@/views/businessEntrust/bsEntrust')
	}, {
		name: 'mgCertificate',
		path: 'mgCertificate',
		meta: {
			isAuthority: "正常",
			headName: ['证书管理', '/', ' 详情']
		},
		component: () => import('@/views/certificateManagement/mgCertificate')
	}, {
		name: 'entrustTbDownload',
		path: 'entrustTb',
		meta: {
			isAuthority: "正常",
		},
		component: () => import('@/views/entrustTbDownload/entrustTbDL')
	}]
}]

//错误提示的路由
export const errorRouter = [
	{
		path: "/404",
		component: () => import('@/components/error-page/error404')
	},
	{
		path: "*",
		redirect: '404',
	},
	{
		path: '/Home',
		component: () => import('@/views/HomePage'),
		children: [{
				path: "404",
				component: () => import('@/components/error-page/error404')
			},
			{
				path: "*",
				redirect: '404',
			}
		]
	}
]

export default router
