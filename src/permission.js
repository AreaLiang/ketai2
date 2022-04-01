import router from './router'
import store from './store'
import axios from 'axios'
import NProgress from 'nprogress' // 引入头部进度条
import 'nprogress/nprogress.css' // 进度条样式

NProgress.configure({
	showSpinner: false
}) // 进度条

router.beforeEach(async (to, from, next) => {
	NProgress.start() //开启进度条

	let data = store.state.userInfo;
	let userInfo = JSON.parse(JSON.stringify(data)); //去除隐形属性
	userInfo = {
		...userInfo[0]
	}; //解构赋值

	//用户权限判断
	if (to.path == "/Login") {
		sessionStorage.removeItem('token');
		next();
	} else {
		(async ()=>{
			let token = await sessionStorage.getItem('token', token);
			if (token) {
				if (store.state.userInfo.code != "20000") {
					
					//发送token去后端验证用户信息
					await store.dispatch('authorityNav', token).then(() => {
						//从vuex中获取过滤后的路由表
						let setRoutes = store.state.permissionRoutes;
						
						router.addRoute(setRoutes)
					});
				}
				
			} else {
				router.push('/Login');
			}
			await next();
			await NProgress.done();
		})();
		
	}
	
	
});
