import Vuex from "vuex"
import Vue from 'vue'
import axios from 'axios'
import {
	asyncRouter
} from '@/router'
import {
	navRouter
} from '@/utils/permissionsTb'
import '@/request/http.js'
import {
	ckUserInfoApi
} from "@/request/api"

const actions = {
	// 用户权限控制
	authorityNav(context, value) {
		return new Promise((resolve, reject) => {
			//发送请求查询用户信息
			ckUserInfoApi(value).then((data) => {
				if (data.code == "20000") {
					context.commit('AuthorityNav', data.data.statusCn);
					context.commit('UserInfo',data);
				}
				resolve();
			})
		});
		
	}
}
const mutations = {
	//保存用户的信息
	UserInfo(state, value) {
		state.userInfo = value;
		console.log("我是vxu的UserInfo:",value)
		state.token = value.data.token;
	},
	// 用户权限控制
	AuthorityNav(state, useStatus) {
		let data = asyncRouter; //获取所有动态路由

		//过滤后的动态导航信息
		let newRouter = new navRouter(data, useStatus);
		state.permissionRoutes = newRouter.call();
	}
}

const state = {
	userInfo: [], //用户信息
	token: '',
	permissionRoutes: [], //过滤后的权限路由表
}

const getters = {
	isCertification: (state) => {return {...state.userInfo.data}.statusCn}
}

Vue.use(Vuex)
export default new Vuex.Store({
	actions,
	mutations,
	state,
	getters
})
