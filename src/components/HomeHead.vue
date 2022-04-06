<template>
	<div class="home-head">
		<div class="img-box">
			<img src="../assets/home/steelyard.png">
			<img src="../assets/login/fromtitle.png">
		</div>
		<div class="username">
			<el-popover placement="bottom" width="100" trigger="click">
				<el-button slot="reference">
					<i class="el-icon-user-solid"></i>
					<span>{{username}}</span>
					<i class="el-icon-caret-bottom"></i>
				</el-button>
				<slot>
					<ul style="padding: 0;">
						<li style="list-style: none;cursor: pointer;" @click="signou()">
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
	export default {
		name: 'HomeHead',
		data() {
			return {
				username: 'Area6666666'
			}
		},
		components: {

		},
		methods:{
			signou(){
				signoutApi({}).then((data)=>{
					console.log("登出",data)
					if (data.code=="20000") {
						this.$message.success("退出成功");
						setTimeout(()=> {
							this.$router.push("/Login")
						}, 1000);
					}else{
						this.$message.error("退出失败");
					}
				});
			}
		},
		mounted(){
			
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
				float: left;
				padding: 2px 15px;
			}

			img:nth-child(1) {
				width: 260px;
			}

			img:nth-child(2) {
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
