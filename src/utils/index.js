import router from '@/router'
// import store from './store'

//删除浏览器缓存,isGoLoigin是否转跳到登录页面，默认转跳
export function removeSessionStorage(name,isGoLoigin){
	isGoLoigin=isGoLoigin==true? true : false;
	
	sessionStorage.removeItem(name);//清除缓存
	if(isGoLoigin){
		router.push("/Login");
	}
}

// //发送token去后端验证用户信息
// export function sendInfoCk(name,isGoLoigin){
// 	await store.dispatch('authorityNav', token).then(() => {
// 		//从vuex中获取过滤后的路由表
// 		let setRoutes = store.state.permissionRoutes;
		
// 		router.addRoute(setRoutes)
// 	});
// }

