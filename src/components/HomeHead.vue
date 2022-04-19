<template>
	<div class="home-head">
		<div class="img-box">
			<a href="http://www.gdketai.com/">
				<img src="../assets/home/steelyard.png">
			</a>
			<a href="http://www.gdketai.com/">
				<img src="../assets/home/fromtitle.png">
			</a>
		</div>
		<div class="username">
			<el-popover placement="bottom" width="100" trigger="click">
				<el-button slot="reference">
					<i class="el-icon-user-solid"></i>
					<span>{{userInfo.name}}</span>
					<i class="el-icon-caret-bottom"></i>
				</el-button>
				<slot>
					<ul style="padding: 0;">
						<li style="list-style: none;cursor: pointer;" @click="signOut()">
							<span class="iconfont icon-exit" style="padding: 0 10px;"></span>
							<span>退出</span>
						</li>
					</ul>
				</slot>
			</el-popover>
		</div>
	</div>
</template>

<script>
	import { signoutApi } from "@/request/api"
	import {mapState} from "vuex"
	import {resetRouter} from '@/router'
	import NProgress from 'nprogress' // 引入头部进度条
	
	export default {
		name: 'HomeHead',
		data(){
			return {
				hasExited:true,//是否已经完成退出
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods:{
			signOut(){
				if(this.hasExited){//判断是否已经退出完成，防止多次点击提交退出事件
					this.hasExited=false;
					NProgress.start() //开启进度条
					signoutApi({}).then((data)=>{
						if (data.code=="20000") {
							this.$message.success("退出成功");
							setTimeout(()=> {
								resetRouter();//重置路由
								this.$router.push("/Login")
							}, 500);
						}else{
							this.$message.error("退出失败");
						}
						this.hasExited=true;
						NProgress.done(); //结束进度条
					});
				}
			}
		}
	}
</script>

<style lang="less">
	@import '@/less/common';

	@headColor: #067d9f;
	@headText: white;

	.home-head {
		background: @headColor;
		height: 100%;
		width: 100%;
		overflow: hidden;

		.img-box {
			width: 80%;
			height: 100%;
			position: relative;
			overflow: hidden;
			float: left;

			img {
				position: relative;
				vertical-align: middle;
				
				width: 100%;
			}
			
			a{
				display: block;
				float: left;
				padding: 2px 15px;
				line-height: 71px;
			}
			a:nth-child(1) {
				width: 260px;
			}

			a:nth-child(2) {
				width: 540px;
			}
		}

		.username {
			cursor: pointer;
			float: right;
			line-height: 73.5px;
			padding: 0 15px;
			color: @headText;
			max-width: 210px;

			i {
				padding: 0 2px;
			}

			.el-button {
				border: 0;
				background: @headColor;
				color: @headText;
			}

			// .exitbox{
			// 	width: 150px;
			// 	height: 50px;
			// 	background-color: #fdfdfd;
			// 	position: absolute;
			// 	box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
			// 	color: black;
			// }
		}
	}
</style>
