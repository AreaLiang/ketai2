<template>
	<div class="login">
		<div class="login-box">
			<el-container>
				<el-header>
					<div class="lb-head">
						<img src="../assets/login/fromtitle.png">
					</div>
				</el-header>
				<el-main>
					<div class="input-item" :class="{register:isRegister}">
						<el-input placeholder="请输入公司全称" v-model="userInfo.account">
							<template slot="prepend">
								<i class="el-icon-user-solid" v-show="!isRegister"></i>
								<span>客户名称</span>
							</template>
						</el-input>
					</div>
					<div class="input-item" :class="{register:isRegister}">
						<el-input placeholder="请输入登录密码" v-model="userInfo.password" type="password">
							<template slot="prepend">
								<i class="iconfont icon-lock" v-show="!isRegister"></i>
								<span>登录密码</span>
							</template>
						</el-input>
					</div>
					<template v-if="isRegister">
						<div class="input-item" :class="{register:isRegister}">
							<el-input placeholder="请再次输入登录密码" v-model="userInfo.passwordAgain" type="password">
								<template slot="prepend">
									<span>确认密码</span>
								</template>
							</el-input>
						</div>
						<div class="input-item" :class="{register:isRegister}">
							<el-input placeholder="请输入联系人姓名" v-model="userInfo.connectName" type="password">
								<template slot="prepend">
									<span>联系人</span>
								</template>
							</el-input>
						</div>
						<div class="input-item" :class="{register:isRegister}">
							<el-input placeholder="请输入联系手机号" v-model="userInfo.connectPhone" type="password">
								<template slot="prepend">
									<span>联系手机号</span>
								</template>
							</el-input>
						</div>
						<div class="input-item" :class="{register:isRegister}">
							<div class="bs-range bs-item">
								<span>业务范围</span>
							</div>
							<div class="bs-checkbox bs-item">
								<el-checkbox label="陶瓷"></el-checkbox>
								<el-checkbox label="铝型材"></el-checkbox>
								<el-checkbox label="汽配"></el-checkbox>
								<el-checkbox label="电子"></el-checkbox>
								<el-checkbox label="危化品"></el-checkbox>
								<el-checkbox label="水泥"></el-checkbox>
								<el-checkbox label="印染"></el-checkbox>
								<el-checkbox label="其他"></el-checkbox>
							</div>
						</div>
					</template>
				</el-main>
				<div>
					<hr>
					</hr>
				</div>
				<el-footer>
					<div class="sub-btn">
						<span class="se_online">客服热线：0758-2777310</span>
						<div class="op-div">
							<el-button type="success" style="background-color: #49afcd;border-color: #49afcd;"
								@click="login()">登录</el-button>
							<el-button type="success" @click='register()'>我要注册</el-button>
						</div>
					</div>
				</el-footer>
			</el-container>
		</div>
	</div>
</template>

<script>
	import {
		getUserInfo
	} from '@/api'
	export default {
		name: 'Login',
		data() {
			return {
				userInfo: {
					account: 'user002',
					password: 'ab12345',
					passwordAgain: '',
					connectName: '',
					connectPhone: ''
				},
				isRegister: false
			}
		},
		methods: {
			login() {
				let account = this.userInfo.account; //获取用户输入的账号
				let passWord = this.userInfo.password; //获取用户输入的密码

				const loginfun = new Promise((resolve, reject) => {

					let url = getUserInfo().url; //获取后台接口的api
					let method = getUserInfo().method;

					//请求用户数据
					this.axios({
						url: url,
						method: method
					}).then((response) => {
						resolve(response.data)
					}).catch((error) => reject(error))

				})

				loginfun.then((data) => {
					console.log(data);
					let {
						userId,
						password,
						token
					} = data.userData[1]; //获取后台返回的用户数据


					//后台数据和用户输入的信息做比较
					if (password = passWord && userId == account) {
						console.log("成功")

						/* 
						 *** 存储数据
						 * 存入vuex 
						 * 把token存入浏览器缓存
						 */
						this.$store.commit('UserInfo', data.userData[1]);
						sessionStorage.setItem('token', token)

					} else {
						this.$message('账号或密码不正确');
					}
				}, (error) => {});
			},
			register() {
				this.isRegister = !this.isRegister;

				//重置
				this.userInfo.account = '',
					this.userInfo.password = '',
					this.userInfo.passwordAgain = '',
					this.userInfo.connectName = '',
					this.userInfo.connectPhone = ''
			}
		},
		mounted() {
			//修改标题名称
			document.title = this.$route.meta.title;
		},
	}
</script>

<style lang="less">
	//修改输入框中左边标题颜色
	.modifyEl-input (@color) {
		background-color: @color;
		border: 1px solid @color;
		color: white;
		width: 70px;
		text-align: center;
	}

	/* 有选择性的修改输入框中左边标题颜色,
	*** @start:开始的位置,@end：结束的位置,@color：颜色 
	*/
	.toggleStatus(@start, @end, @color) when (@start <=@end) {
		&:nth-child(@{start}) .el-input-group__prepend {
			.modifyEl-input(@color)
		}

		.toggleStatus(@start+1, @end, @color)
	}

	.login {
		width: 100%;
		height: 100%;
		background-image: url(../assets/login/banner_slide_05.jpg);

		.sub-btn {
			text-align: center;
		}

		.se_online {
			color: white;
		}

		.op-div {
			display: inline-block;
			margin-left: 20px;
		}
	}

	hr {
		background-color: #606870;
		border: none;
		height: 1px;
	}

	.login-box {
		background-color: rgba(0, 0, 0, 0.5);
		width: 600px;
		margin: 0 auto;
		position: relative;
		top: 10%;
		// transform: translateY(-50%);
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		border-radius: 4px;

		.lb-head {
			margin: 10px 0;
		}

		.lb-head>img {
			width: 100%;
		}

		.input-item {
			margin: 15px auto;
			width: 90%;

			.el-checkbox {
				color: white;
			}
		}

		.input-item:nth-child(1) .el-input-group__prepend {
			.modifyEl-input(#28b779)
		}

		.input-item:nth-child(2) .el-input-group__prepend {
			.modifyEl-input(#ffb848)
		}

		.register {
			.toggleStatus(1, 3, #28b779);
			.toggleStatus(4, 6, #ffb848);
			overflow: hidden;
		}

		.bs-range {
			height: 40px;
			line-height: 40px;
			background-color: #ffb848;
			color: white;
			width: 70px;
			text-align: center;
			border-radius:4px 0 0 4px;
			padding: 0 20px;
			vertical-align: middle;
			position: relative;
			margin: 0 auto;
		}
		.bs-item{
			float: left;
		}
		.bs-checkbox {
			width: 370px;
			padding-left: 20px;
		}
	}
</style>
