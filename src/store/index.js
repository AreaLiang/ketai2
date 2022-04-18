import Vuex from "vuex"
import Vue from 'vue'
import axios from 'axios'
import {asyncRouter} from '@/router'
import {navRouter} from '@/utils/permissionsTb'
import {ckUserInfoApi} from "@/request/api"

const actions = {
	// 用户权限控制
	authorityNav(context, token) {
		return new Promise((resolve, reject) => {
			//发送请求查询用户信息
			ckUserInfoApi(token).then((data) => {
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
	//登录后保存用户信息
	Login(state, value){
		state.userInfo = value.data.customer;
		state.token = value.data.token;
	},
	//保存用户的信息
	UserInfo(state, value) {
		state.userInfo = value.data;
		console.log("我是vxu的UserInfo:",value.data)
	},
	// 用户权限控制
	AuthorityNav(state, useStatus) {
		let asyncRouteList = asyncRouter; //获取所有动态路由

		//过滤后的动态导航信息	
		state.permissionRoutes = navRouter(asyncRouter, useStatus);
	}
}

const state = {
	userInfo: [], //用户信息
	token: '',
	permissionRoutes: [], //过滤后的权限路由表
}

const getters = {
	isCertification: (state) => {return {...state.userInfo}.statusCn}
	// isCertification: (state) => '正常'
}

Vue.use(Vuex)
export default new Vuex.Store({
	actions,
	mutations,
	state,
	getters
})
