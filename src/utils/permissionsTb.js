import axios from 'axios'
import {ckUserInfoApi} from '@/api'

//过滤路由表的构造函数
class navRouter {
	constructor(routeList, identity) {
		this.routeList = routeList;
		this.identity = identity;
	}
	call() {
		//过滤 符合条件的路由导航 路由
		let filterRouter = this.routeList[0].children.filter((p) => {
			return p.meta.isAuthority == this.identity;
		})
		let originalRoute = this.routeList[0]; //原路由
		originalRoute.children = filterRouter //替换原路由的子路由
		return originalRoute;
	}
};


//检查用户信息
async function ckUserInfo(token) {
	let {
		method,
		url
	} = ckUserInfoApi();
	
	await axios({
			method: method,
			url: url,
			data: {
				token: token
			}
		}).then((data) => {
			console.log(data)
		})
		.catch((e) => e);
}

export {
	navRouter,
	ckUserInfo
};
