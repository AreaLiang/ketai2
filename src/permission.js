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
});
