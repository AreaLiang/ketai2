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
						<el-input placeholder="请输入公司全称" v-model.trim="userInfo.account">
							<template slot="prepend">
								<i class="el-icon-user-solid" v-show="!isRegister"></i>
								<span>客户名称</span>
							</template>
						</el-input>
					</div>
					<div class="input-item" :class="{register:isRegister}">
						<el-input placeholder="请输入登录密码" v-model.trim="userInfo.password" type="password">
							<template slot="prepend">
								<i class="iconfont icon-lock" v-show="!isRegister"></i>
								<span>登录密码</span>
							</template>
						</el-input>
					</div>
					<template v-if="isRegister">
						<div class="input-item" :class="{register:isRegister}">
							<el-input placeholder="请再次输入登录密码" v-model.trim="userInfo.passwordAgain" type="password">
								<template slot="prepend">
									<span>确认密码</span>
								</template>
							</el-input>
						</div>
						<div class="input-item" :class="{register:isRegister}">
							<el-input placeholder="请输入联系人姓名" v-model.trim="userInfo.connectName">
								<template slot="prepend">
									<span>联系人</span>
								</template>
							</el-input>
						</div>
						<div class="input-item" :class="{register:isRegister}">
							<el-input placeholder="请输入联系手机号" v-model.trim="userInfo.connectPhone">
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
								<el-checkbox-group v-model="userInfo.checkList">
									<el-checkbox label="铝型材"></el-checkbox>
									<el-checkbox label="陶瓷"></el-checkbox>
									<el-checkbox label="汽配"></el-checkbox>
									<el-checkbox label="电子"></el-checkbox>
									<el-checkbox label="危化品"></el-checkbox>
									<el-checkbox label="水泥"></el-checkbox>
									<el-checkbox label="印染"></el-checkbox>
									<el-checkbox label="其他"></el-checkbox>
								</el-checkbox-group>
							</div>
						</div>
						<div class="input-item" :class="{register:isRegister}">
							<el-input placeholder="请输入验证码" v-model.trim="userInfo.connectPhone">
								<template slot="prepend">
									<img :src="checkCaptcha" style="height: 34px;width: 70px;" alt="">
								</template>
							</el-input>
						</div>
					</template>
				</el-main>
				<div>
					<hr>
					</hr>
				</div>
				<el-footer>
					<div class="sub-btn">
						<el-checkbox v-show="isRegister" v-model="userInfo.agreesCheck">同意 <a
								href="http://customer.gdketai.com/file/pdfDocument/zcb.pdf">客户注册协议</a></el-checkbox>
						<span class="hotline">客服热线：0758-2777310</span>
						<div class="op-div">
							<el-button type="success" v-show="!isRegister"
								style="background-color: #49afcd;border-color: #49afcd;" @click="login()">登录</el-button>
							<el-button type="success" v-show="!isRegister" @click='goRegister()'>我要注册</el-button>

							<el-button type="success" v-show="isRegister"
								style="background-color: #49afcd;border-color: #49afcd;" @click="register()">注册
							</el-button>
							<el-button type="success" v-show="isRegister" @click='isRegister=!isRegister'>返回</el-button>
						</div>
					</div>
				</el-footer>
			</el-container>

			<div class="copyright">
				<span>版权所有: 广东数智信息科技有限公司</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { loginfun,checkRegister} from "@/utils/login"
	import {captchaApi} from '@/api'
	export default {
		name: 'Login',
		data() {
			return {
				userInfo: {
					account: 'XX1公司',
					password: '123456',
					passwordAgain: '',
					connectName: '',
					connectPhone: '',
					agreesCheck: false,
					checkList: [],
					
				},
				checkCaptcha:'',
				isRegister: false
			}
		},
		methods: {
			//用户登录
			login() {
				let account = this.userInfo.account; //获取用户输入的账号
				let passWord = this.userInfo.password; //获取用户输入的密码
				
				if(account !='' &&passWord !='' ){
					//调用login.js里面的登录方法，成功后返回数据
					loginfun(account,passWord).then(async (data) => {
						// console.log("登录成功：",{...data});
						data = {...data};
						let code = data.code;
						let token=data.data.token;
					
						//后台数据和用户输入的信息做比较
						if (code == "20000") {
							// 存储数据 存入vuex 
							await this.$store.commit('UserInfo', data);
							await sessionStorage.setItem('token',token);
							await this.$router.push('/Home/userinfo');
						} else {
							this.$message.error('账号或密码不正确');
						}
					}, (error) => error);
				}else{
					this.$message.error('账号或密码不能为空');
				}
			},
			goRegister() {
				this.isRegister = !this.isRegister;
				this.reset(); //重置
			},
			//用户注册
			register() {
				let isPassd=checkRegister(this,this.userInfo);
				// if(isPassd){
					
				// }
			},
			reset() {
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
			
			this.checkCaptcha=captchaApi().url;
		},
	}
</script>

<style lang="less">
	@import '@/less/common';

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
		.pu_bgimg;
		min-width: 650px;
		min-height: 550px;

		.sub-btn {
			text-align: center;
			color: white;

			a {
				color: beige;
			}
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
		}

		.el-checkbox {
			color: white;
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
			border-radius: 4px 0 0 4px;
			padding: 0 20px;
			vertical-align: middle;
			position: relative;
			margin: 0 auto;
		}

		.bs-item {
			float: left;
		}

		.bs-checkbox {
			width: 370px;
			padding-left: 20px;
		}

		.hotline {
			margin-left: 10px;
		}

		.copyright {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			margin-top: 30px;
			color: white;
		}
	}
</style>
