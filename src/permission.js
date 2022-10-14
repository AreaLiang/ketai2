<<<<<<< HEAD
import router from './router'
import store from'./store'
import axios from 'axios'
import NProgress from 'nprogress' // 引入头部进度条
import 'nprogress/nprogress.css' // 进度条样式

NProgress.configure({
	showSpinner: false
}) // 进度条

router.beforeEach(async(to, from, next) => {
	NProgress.start() //开启进度条
	
	let data=store.state.userInfo;
	let userInfo=JSON.parse(JSON.stringify(data));//去除隐形属性
	userInfo={...userInfo[0]};//解构赋值
	
	//用户权限判断
	if(to.path=="/Login"){
		sessionStorage.removeItem('token');
	}else{
		let token=sessionStorage.getItem('token',token);
		if(token){
			
			if(store.state.userInfo.length<=0){
				store.dispatch('authorityNav',token);
				
				//从vuex中获取过滤后的路由表
				let setRoutes=JSON.parse(JSON.stringify(store.state.permissionRoutes));
				// console.log(setRoutes)
				setRoutes=Array.from(setRoutes);//转变数组
				setRoutes.forEach((p)=>{//把路由表读取并逐个添加
					router.addRoute(setRoutes)
				});
			}
			
		}else{
			router.push('/Login');
		}
	}
	next()
	NProgress.done()
=======
import router from './router'
import store from './store'
import NProgress from 'nprogress' // 引入头部进度条
import 'nprogress/nprogress.css' // 进度条样式
import {removeSessionStorage} from "@/utils"
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
>>>>>>> main
});
