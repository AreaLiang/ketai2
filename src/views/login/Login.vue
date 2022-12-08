<template>
	<div class="login">
		<div class="login-box">
			<el-container>
				<el-header>
					<div class="lb-head">
						<img src="@/assets/login/fromtitle.png">
					</div>
				</el-header>
				<el-main>
					<div class="logon-item" v-if="!isRegister">
						<div class="input-item">
							<el-input placeholder="请输入公司全称" maxlength="32" show-word-limit v-model.trim="userInfo.account" @keyup.enter.native="keyupLogin" v-focus>
								<template slot="prepend">
									<i class="el-icon-user-solid" v-show="!isRegister"></i>
									<span>客户名称</span>
								</template>
							</el-input>
						</div>
						<div class="input-item">
							<el-input placeholder="请输入登录密码" maxlength="16" v-model.trim="userInfo.password" type="password" @keyup.enter.native="keyupLogin">
								<template slot="prepend">
									<i class="iconfont icon-lock" v-show="!isRegister"></i>
									<span>登录密码</span>
								</template>
							</el-input>
						</div>
					</div>
					<div class="register-item">
						<component ref="dynamicComponents" :is="dynamicComponents"/>
					</div>
				</el-main>
				<div>
					<hr>
					</hr>
				</div>
				<el-footer>
					<div class="sub-btn">
						<el-checkbox v-show="isRegister" v-model="userInfo.agreesCheck">同意 <a href="/file/zcb.pdf" target="_blank">客户注册协议</a></el-checkbox>
						<span class="hotline">客服热线：0758-2777310</span>
						<div class="op-div">
							<el-button type="success" v-show="!isRegister" style="background-color: #49afcd;border-color: #49afcd;"  @click="login()" v-throttle>登录</el-button>
							<el-button type="success" v-show="!isRegister" @click='goRegister()' >我要注册</el-button>

							<el-button type="success" v-show="isRegister"
								style="background-color: #49afcd;border-color: #49afcd;" @click="register()" v-throttle>注册
							</el-button>
							<el-button type="success" v-show="isRegister" @click='isRegister=!isRegister'>返回</el-button>
							
						</div>
					</div>
				</el-footer>
			</el-container>

			<div class="copyright">
				<span>版权所有: {{companyName}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { resetRouter} from "@/router"
	import NProgress from 'nprogress' // 引入头部进度条
	import {checkRegister} from "./js/login"
	export default {
		name: 'Login',
		data() {
			return {
				userInfo: {
					account: '',
					password: '',
					agreesCheck:false
				},
				companyName:global_companyName ,//公司名称 ，在vue.config.js设置
				dynamicComponents:"",//动态组件显示
				isRegister:false ,//是否切换到注册界面
			}
		},
		watch: {
			isRegister: function(val) {
				if (val) this.dynamicComponents="register";
				else this.dynamicComponents="";
			}
		},
		methods: {
			//用户登录
			login() {
				let account = this.userInfo.account; //获取用户输入的账号
				let passWord = this.userInfo.password; //获取用户输入的密码
				NProgress.start() //开启进度条
				if (account != '' && passWord != '') {
					//调用login接口，成功后返回数据
					this.api.loginApi({
						loginname: account,
						password: passWord
					}).then(async (data) => {
						data = {...data};
						let code = data.code; //获取状态吗
						//后台数据和用户输入的信息做比较
						if (code == "Ok" ) {
							console.log("登录成功：", {...data});
							
							let token = data.data.token;
							let status=data.data.customer.status;
							
							// 存储数据 存入vuex 
							await this.$store.commit('Login', data);
							sessionStorage.setItem('token', token);
							
							resetRouter();//重置路由
							
							this.$store.commit('GenerateRoutes',status);//导航的权限控制
							let accessRoutes=this.$store.state.permissionRoutes;
							accessRoutes.forEach( p => {this.$router.addRoute(p)});
							
							//转跳到用户信息页面
							this.$router.replace('/Home/userinfo');
						} else {
							this.$message.error('账号或密码不正确');
						}
						
					}, (error) => error);
				} else {
					this.$message.error('账号或密码不能为空');
				}
				NProgress.done();
			},
			keyupLogin(){//enter 回车按键登录
				this.login();
			},
			//点击 去注册按钮 事件
			goRegister() {
				this.isRegister = !this.isRegister;
				//this.captchaUrl = this.api.captchaApi(); //登录和注册界面切换后，验证码更换
				this.reset(); //重置
			},
			//用户注册
			register() {
				let userInfo=this.$refs.dynamicComponents.userInfo;
				let isPassd = checkRegister(userInfo);
				
				if (isPassd) {
					if (!this.userInfo.agreesCheck) return this.$message.warning("请查看客户注册协议，并勾选同意");
					//获取用户输入信息
					let {
						account,
						password,
						connectName,
						connectPhone,
						phoneCode,
						checkList,
						captcha,
						area
					} = userInfo;
			
					checkList = checkList.join(','); //数组转换成字符串
			
					this.api.registerApi({
						phoneCode: phoneCode,
						phone: connectPhone,
						name: account,
						contact: connectName,
						password: password,
						business: checkList,
						code: captcha,
						area: area
					}).then((res) => {
						console.log(res)
						if (res.code == "Ok") {
							this.$message.success('注册成功');
							this.isRegister = false;
							this.reset();
						} else {
							this.$message.error(res.msg);
						}
					})
				}
			},
			//表单重置
			reset() {
				//重置对象的键值，注意顺序，agreesCheck 后面的都是自己填写重置信息，然后跳出循环
				for(let item in this.userInfo){
					if(item=="agreesCheck"){//根据需要自己填写
						this.userInfo.agreesCheck=false;
						this.userInfo.checkList=[];
						break;
					}
					this.userInfo[item]="";
				}
			}
		},
		components:{
			register:()=>import ('./Register')
		}
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
		.el-input__inner{
			line-height: 1px !important;
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
			&:after{
				content:"";
				display:block;
				visibility:hidden;
				clear:both;
			}
		}

		.input-item:nth-child(1) .el-input-group__prepend {
			.modifyEl-input(#28b779)
		}

		.input-item:nth-child(2) .el-input-group__prepend {
			.modifyEl-input(#ffb848)
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
