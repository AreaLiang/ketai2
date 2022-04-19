import router from './router'
import store from './store'
import axios from 'axios'
import NProgress from 'nprogress' // 引入头部进度条
import 'nprogress/nprogress.css' // 进度条样式
import {
	removeSessionStorage,
	sendInfoCk,
	addAsyncRouter
} from "@/utils"
import {
	errorRouter
} from './router'

NProgress.configure({
	showSpinner: false
}) // 进度条

router.beforeEach(async (to, from, next) => {
	NProgress.start() //开启进度条

	let data = store.state.userInfo;

	let userInfo = JSON.parse(JSON.stringify(data)); //去除隐形属性

	//用户权限判断
	if (to.path == "/Login") {
		removeSessionStorage('token', false); //清除缓存
		next();
		NProgress.done();
	} else {
		(async () => {
			let token = await sessionStorage.getItem('token'); //获取缓存中的token
			if (token) {
				if (JSON.stringify(data) == "[]") {
					//发送token去后端验证用户信息
					await store.dispatch('authorityNav', token).then(() => {
						/* 登录后和当前页面刷新权限验证时候 动态路由添加*/
						addAsyncRouter();
						next({...to,replace: true}); //放行
					});
				}
			} else {
				router.push('/Login');
			}
			next();
			NProgress.done();
		})();
	}
});
