import router from '@/router'
import { Message } from 'element-ui';
import {baseUrl} from '@/request/api'
import {errorRouter} from '@/router'
import store from '@/store'
/**
 * 删除浏览器缓存
 * @param {String} name [缓存的名称]
 * @param {boolean} isGoLoigin [是否转跳到登录页面，默认转跳]
 */
export function removeSessionStorage(name, isGoLoigin) {
	isGoLoigin = isGoLoigin == true ? true : false;

	sessionStorage.removeItem(name); //清除缓存
	if (isGoLoigin) {//转跳登陆页面
		router.push("/Login");
	}
}

//图片转换成base 64格式方法
export function getBase64(file) {
	return new Promise((resolve, reject) => {
		let rd = new FileReader() // 创建文件读取对象
		rd.readAsDataURL(file) // 文件读取装换为base64类型
		rd.onloadend = function(e) {
			// this指向当前方法onloadend的作用域, this.result就是文件的base64， 这里可自由处理
			resolve(this.result);
		}
	})
}

//时间戳转换
export function timestamp(nS) {
	return new Date(parseInt(nS) * 1).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

//仅使用于element UI 的照片格式验证
export function isImgFormat(file){
	const isJEPG = file.type === 'image/jpeg';
	const isJPG = file.type === 'image/jpg';
	const isPNG = file.type === 'image/png';
				
	if (isJEPG || isJPG || isPNG) {
		return true
	} else {
		Message.error('证件只能是上传图片格式!');
		return false
	}
}

/**
 * 委托文件、委托单返回的路径
 * @param {String} file [传入后台返回的路径字符串]
 * @param {String} suffix [文件后缀]
 */
export function fileShowPath(file,suffix){
	if(file){
		let fileUrl=file+suffix;//文件路径
		
		let reg=new RegExp("hall");//匹配服务端的 hall字符串，准备替换
		let newUrl=baseUrl.replace(reg,fileUrl);
		return newUrl;
	}else{
		return '';
	}
}

 /* 登录后和当前页面刷新权限验证时候 动态路由添加*/
export  function addAsyncRouter(){
	//从vuex中获取过滤后的路由表
	let setRoutes =  store.state.permissionRoutes;

	//添加导航路由
	router.addRoute(setRoutes);
	
	//加载 错误提示页面 的路由
	errorRouter.forEach((p)=>{
		router.addRoute(p);
	})
}

/**
 * 用于ElementUI 表单验证规则的集合，自己写特定的规则，常用规则可在type直接调用
 * @param  rule	[源描述符中的验证规则，对应于正在验证的字段名称。它总是被分配一个field带有被验证字段名称的属性。]
 * @param  value [正在验证的源对象属性的值。]
 * @param  callback [验证完成后调用的回调函数。它期望传递一个Error实例数组来指示验证失败。如果检查是同步的，可以直接返回一个falseorError或Error Array]
 * *** 验证里面的type 可选email、string、number、boolean、url、date、any等等
 * 详细参考 https://github.com/yiminghe/async-validator（需要翻墙）
 */
export const formValidation={
	//判断只能输入1开头第二位数字是3456789中一个，后面九位数随便填，总共十一位电话号码。
	phone:(rule, value, callback)=>{
		var patrn = /^1[3456789]\d{9}$/;
		if(patrn.test(value)==false){
			return callback(new Error('请输入正确的11位手机号码！'));
		}else{
			return callback();
		}
	},
}