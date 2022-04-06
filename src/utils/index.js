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

//图片转换成base 64格式方法
export function getBase64(file){
	return new Promise((resolve,reject)=>{
		let rd = new FileReader() // 创建文件读取对象
		rd.readAsDataURL(file) // 文件读取装换为base64类型
		rd.onloadend = function(e) {
			// this指向当前方法onloadend的作用域, this.result就是文件的base64， 这里可自由处理
			resolve(this.result);
		}
	})
}

// //发送token去后端验证用户信息
// export function sendInfoCk(name,isGoLoigin){
// 	await store.dispatch('authorityNav', token).then(() => {
// 		//从vuex中获取过滤后的路由表
// 		let setRoutes = store.state.permissionRoutes;
		
// 		router.addRoute(setRoutes)
// 	});
// }

