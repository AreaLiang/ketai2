import router from '@/router'
import {
	Message
} from 'element-ui';
import {
	baseUrl
} from '@/request/api'
import {
	errorRouter,
	asyncRouter
} from '@/router'
import store from '@/store'
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
 * 下载pdf文件
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
	downloadElement.click() //点击下载
	document.body.removeChild(downloadElement) //下载完成移除元素
	if (typeof blob != 'string') {
		window.URL.revokeObjectURL(href) //释放掉blob对象
	}
}
/*End*/

export async function unZipHandle(arr) {
	// arr为需要解压的数组
	let zip = new JSZip();
 	let promises = []; // 存放解压的文件
 	let that = this;
 	// 这里用await就是为了改成同步，需要等数据处理完才进行下一步
 	await arr.forEach((item) => {
        let promise = that
          .getUrlBuffer(item)
          .then((pdf) => {
            // getUrlBuffer这里是把url解压转化成文件
            for (let key in pdf.files) {
              // 判断是否是目录
              if (!pdf.files[key].dir) {
                if (/\.(pdf)$/.test(pdf.files[key].name)) {
                // 这里判断是pdf文件，其他文件的话，换个格式
                  return pdf
                    .file(pdf.files[key].name)
                    .async("ArrayBuffer")
                    .then((data) => {
						// 把文件转化为buffer
                      // this.arrayBufferToBlob(data);这个是因为pdf需要展示，所以我这边把buffer转化成blob文件会得到个url，方便用来展示。后面会补充这个方法
                      // return出buffer生成的文件
                      return zip.file(pdf.files[key].name, data, {
                        binary: true,
                      });
                    });
                }
              }
            }
            // zip.file("测试", pdf, { binary: true });
          });
          // 将循环得到的所有promise存到一个数组里面
        promises.push(promise);
      });
      Promise.all(promises) // this.policyNo
        .then((res) => {
        	// 这里就简单了，当所有promise执行完之后，打包下载
          zip
            .generateAsync({
              type: "blob",
            })
            .then((content) => {
            	// zipName这个是压缩包名称，可以自己定义
               FileSaver.saveAs(content, zipName);
            });
        });
}


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
