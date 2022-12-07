import VueRouter from "vue-router"

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

//静态路由
export const constantRoutes=[{
		path: '/',
		redirect: '/Home'
	},
	{
		name: 'Login',
		path: '/Login',
		meta: {
			title: `${global_companyName}登录界面` //修改单个页面的标题
		},
		component: () => import('@/views/login/Login')
	},
	{
		name: 'Home',
		path: '/Home',
		component: () => import('@/views/HomePage'),
		children: [{
				name: 'UserInfo',
				path: 'userinfo',
				meta: {
					headName: ['客户信息', '/', '完善认证信息'],
				},
				component: () => import('@/views/userInfo/UserInfo')
			},
			{
				name: 'PdChange',
				path: 'password',
				meta: {
					headName: ['密码更改', '/', ' 密码录入'],
				},
				component: () => import('@/views/passwordChange/PdChange')
			},
			{
				name: 'pdfView',
				path: 'serviceList',
				component: () => import('@/views/serviceList/PdfView')
			},
			{
				name: 'customerGuidelines',
				path: 'customerGuidelines',
				component: () => import('@/views/customerGuidelines/customerGuidelines')
			}
		]
	}
]


// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRouter = [{
	path: '/Home',
	component: () => import('@/views/HomePage'),
	meta:{
		authorityStatus:'all'
	},
	children: [{
		name: 'businessEntrust',
		path: 'businessEntrust',
		meta: {
			authorityStatus: "ZhengChang",
			headName: ['委托单管理', '/', ' 详细业务'],
		},
		component: () => import('@/views/businessEntrust/bsEntrust')
	}, {
		name: 'mgCertificate',
		path: 'mgCertificate',
		meta: {
			authorityStatus: "ZhengChang",
			headName: ['证书管理', '/', ' 详情'],
		},
		component: () => import('@/views/certificateManagement/mgCertificate')
	}]
}]

//错误提示的路由
export const errorRouter = [
	{
		name:'error',
		path: "/404",
		component: () => import('@/components/error-page/error404')
	},
	{
		name:'error2',
		path: "*",
		redirect: '404',
	},
	{
		name:'error3',
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

const createRouter = () =>new VueRouter ({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter();

//路由守卫后置钩子
router.afterEach((to,from)=>{
	//修改标题名称
	document.title = to.meta.title || global_companyName; //如果没有标题名，默认显示“global_companyName 中的 广东科泰计量检测科技有限公司 ，在vue.config.js设置”
})

//重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
