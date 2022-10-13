import router from './router'
import store from './store'
import NProgress from 'nprogress' // 引入头部进度条
import 'nprogress/nprogress.css' // 进度条样式
import {removeSessionStorage,} from "@/utils"
import { Message } from 'element-ui'

NProgress.configure({
	showSpinner: false
}) // 进度条

router.beforeEach(async (to, from, next) => {
	NProgress.start() //开启进度条
	const whiteList =new Set(['/Login']);//白名单,不需要权限的页面
	const token=sessionStorage.getItem('token');//获取用户 token
	
	if(token){//如果token存在，则跳过登录界面，直接进去后台主页
	
		//判断vuex里面是否有存在用户信息，没有则重新请求发送获取和验证
		const hasRole= JSON.stringify(store.state.userInfo) === '[]';
		
		if(hasRole){
			(async ()=> {
				//校验用户token
				const status=await store.dispatch('checkUserInfo',token);
				if(status){
					await store.commit('GenerateRoutes',status);
					let accessRoutes=store.state.permissionRoutes;
					accessRoutes.forEach( p => router.addRoute(p));
					
					next({ ...to, replace: true })
				}else {
					Message.error("用户身份验证失败,正在为你转跳登录页面");
					setTimeout(()=>{removeSessionStorage('token', true)},1000); //清除缓存并转跳登录页
				}
			})();
		}else next()
		
	}else{
		//如果在白名单内则通过
		if (whiteList.has(to.path)) next();
		else router.push('/Login');
	}
	NProgress.done();
});
