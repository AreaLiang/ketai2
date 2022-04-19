import router,{resetRouter,errorRouter,asyncRouter} from '@/router'
import {Message} from 'element-ui';
import {baseUrl} from '@/request/api'
import store from '@/store'
import JSZip from "jszip";
import {saveAs} from 'file-saver';
import axios from 'axios'

/**
 * 删除浏览器缓存
 * @param {String} name [缓存的名称]
 * @param {boolean} isGoLoigin [是否转跳到登录页面，默认转跳]
 */
export function removeSessionStorage(name, isGoLoigin) {
	isGoLoigin = isGoLoigin == true ? true : false;

	sessionStorage.removeItem(name); //清除缓存
	if (isGoLoigin) { //转跳登陆页面
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
export function isImgFormat(file) {
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
export function fileShowPath(file, suffix) {
	if (file) {
		let fileUrl = file + suffix; //文件路径

		let reg = new RegExp("hall"); //匹配服务端的 hall字符串，准备替换
		let newUrl = baseUrl.replace(reg, fileUrl);
		return newUrl;
	} else {
		return '';
	}
}
//Generator函数，重置路由后添加路由，防止重复添加造成路由污染
export function* dynamicRoute(){
	yield resetRouter();
	yield addAsyncRouter();
}

/* 登录后和当前页面刷新权限验证时候 动态路由添加*/
export function addAsyncRouter() {
	
	//从vuex中获取过滤后的路由表
	let setRoutes = store.state.permissionRoutes;
	
	//添加导航路由
	router.addRoute(setRoutes);
	
	//加载 错误提示页面 的路由
	errorRouter.forEach((p) => {
		let removeRoute = router.addRoute(p);
	})
}

/**Start
 * 下载单个pdf文件
 * @param {String} url [文件链接]
 * @param {String} name [文件名字]
 */
export function fileLinkToStreamDownload(url, name) {
	let fileName = name;
	let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\/])+$/;
	if (!reg.test(url)) {
		throw new Error('传入参数不合法,不是标准的文件链接')
	} else {
		let xhr = new XMLHttpRequest()
		xhr.open('get', url, true)
		xhr.setRequestHeader('Content-Type', `application/pdf`)
		xhr.responseType = 'blob'
		let that = this
		xhr.onload = function() {
			if (this.status == 200) {
				//接受二进制文件流
				var blob = this.response
				downloadExportFile(blob, fileName)
			}
		}
		xhr.send()
	}
}

function downloadExportFile(blob, tagFileName) {
	let downloadElement = document.createElement('a')
	let href = blob
	if (typeof blob == 'string') {
		downloadElement.target = '_blank'
	} else {
		href = window.URL.createObjectURL(blob) //创建下载的链接
	}
	downloadElement.href = href
	downloadElement.download = tagFileName
	//下载后文件名
	document.body.appendChild(downloadElement)
	// 判断是否是 IE
	if (navigator.msSaveOrOpenBlob) {
		navigator.msSaveOrOpenBlob(blob, tagFileName)
	} else {
		downloadElement.click()
	}
	// downloadElement.click() //点击下载
	document.body.removeChild(downloadElement) //下载完成移除元素
	if (typeof blob != 'string') {
		window.URL.revokeObjectURL(href) //释放掉blob对象
	}
}
/*End*/

/**Start
 * 批量下载pdf文件并打包成一个zip文件
 * @param {Array} arr [多个pdf文件路径的数组]
 */
export function BatchPdfDownload(arr) {
	const zip = new JSZip()
	const cache = {}
	const promises = []
	arr.forEach(item => {
		const promise = getFile(item).then(data => {
			const arr_name = item.split('/') // 下载文件, 并存成ArrayBuffer对象
			const file_name = arr_name[arr_name.length - 1] // 获取文件名
			// .folder("name")这个是把文件放在一个文件夹，不需要可以删去
			zip.folder("证书文件夹").file(file_name, data, {
				binary: true
			}) // 逐个添加文件
			cache[file_name] = data
			console.log(cache)
		})
		promises.push(promise)
	})
	Promise.all(promises).then(() => {
		zip.generateAsync({
			type: 'blob'
		}).then(content => {
			console.log(content)
			// 生成二进制流
			saveAs(content, '证书文件.zip') // 利用file-saver保存文件  自定义文件名
		})
	})
}

function getFile(url) {
	return new Promise((resolve, reject) => {
		let obj = {
			method: 'get',
			url,
			// responseType: 'blob'
			responseType: 'arraybuffer'
		}
		axios(obj).then(data => {
			resolve(data.data)
		})
		.catch(error => {
			reject(error.toString())
		})
	})
}
/*End*/

/**
 * 用于ElementUI 表单验证规则的集合，自己写特定的规则，常用规则可在type直接调用
 * @param  rule	[源描述符中的验证规则，对应于正在验证的字段名称。它总是被分配一个field带有被验证字段名称的属性。]
 * @param  value [正在验证的源对象属性的值。]
 * @param  callback [验证完成后调用的回调函数。它期望传递一个Error实例数组来指示验证失败。如果检查是同步的，可以直接返回一个falseorError或Error Array]
 * *** 验证里面的type 可选email、string、number、boolean、url、date、any等等
 * 详细参考 https://github.com/yiminghe/async-validator（需要翻墙）
 */
export const formValidation = {
	//判断只能输入1开头第二位数字是3456789中一个，后面九位数随便填，总共十一位电话号码。
	phone: (rule, value, callback) => {
		var patrn = /^1[3456789]\d{9}$/;
		if (patrn.test(value) == false) {
			return callback(new Error('请输入正确的11位手机号码！'));
		} else {
			return callback();
		}
	},
}
