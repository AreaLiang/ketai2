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
						<el-input placeholder="请输入公司全称" maxlength="32" show-word-limit v-model.trim="userInfo.account" v-focus>
							<template slot="prepend">
								<i class="el-icon-user-solid" v-show="!isRegister"></i>
								<span>客户名称</span>
							</template>
						</el-input>
					</div>
					<div class="input-item" :class="{register:isRegister}">
						<el-input placeholder="请输入登录密码" maxlength="16" v-model.trim="userInfo.password" type="password" @keyup.enter.native="keyupLogin">
							<template slot="prepend">
								<i class="iconfont icon-lock" v-show="!isRegister"></i>
								<span>登录密码</span>
							</template>
						</el-input>
					</div>
					<template v-if="isRegister">
						<div class="input-item" :class="{register:isRegister}">
							<el-input placeholder="请再次输入登录密码" maxlength="16"  v-model.trim="userInfo.passwordAgain" type="password">
								<template slot="prepend">
									<span>确认密码</span>
								</template>
							</el-input>
						</div>
						<div class="input-item" :class="{register:isRegister}">
							<el-input placeholder="请输入联系人姓名" maxlength="6" show-word-limit v-model.trim="userInfo.connectName">
								<template slot="prepend">
									<span>联系人</span>
								</template>
							</el-input>
						</div>
						<div class="input-item" :class="{register:isRegister}">
							<el-input placeholder="请输入联系手机号" v-model.trim="userInfo.connectPhone" type="number"
								class="no-number">
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
							<div class="area-box">
								<div class="bs-range bs-item">
									<span>所辖区域</span>
								</div>
								<div class="bs-area-radio bs-item">
									<el-radio-group v-model="userInfo.area">
									    <el-radio :label="p.id" v-for="(p,index) in areaList" :key="index" style="color: white">{{p.name}}</el-radio>
									</el-radio-group>
								</div>
							</div>
						</div>
						
						<div class="input-item" :class="{register:isRegister}">
							<el-input placeholder="请输入验证码" maxlength="5" v-model.trim="userInfo.captcha">
								<template slot="prepend">
									<img :src="captchaUrl" @click="changeCaptcha()" class="captcha" alt="">
								</template>
							</el-input>
						</div>
						<div class="input-item" :class="{register:isRegister}">
							<el-input type="number" placeholder="手机验证码"  v-model.trim="userInfo.phoneCode"
								class="phoneCode no-number" >
								<template slot="append">
									<el-button @click="phoneCode()" :disabled="isSendCode" v-throttle>{{sendCodeText}}</el-button>
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
	import {checkRegister,registerfun} from "@/utils/login"
	import { resetRouter} from "@/router"
	import NProgress from 'nprogress' // 引入头部进度条
	
	export default {
		name: 'Login',
		data() {
			return {
				userInfo: {
					account: '',
					password: '',
					passwordAgain: '',
					connectName: '',
					connectPhone: '',
					captcha: '',
					phoneCode: '',
					agreesCheck: false,
					checkList: [],
					area:''
				},
				captchaUrl: '', //验证码图片地址
				isRegister: false, //是否显示注册界面
				sendCodeText: '获取手机验证码', //获取手机验证码文字显示
				isSendCode: false ,//是否已经发送验证码
				companyName:global_companyName ,//公司名称 ，在vue.config.js设置
				areaList:[]//所辖区域集合
			}
		},
		watch: {
			isRegister: function(val) {
				if (val) {
					this.changeCaptcha();
				}
			}
			// isSendCode: function(val) {
			// 	if (val) {
			// 		let time = 30; //限制多少秒后可以重新发送手机验证码
			// 		let timeRange = setInterval(() => {
			// 			time--;
			// 			this.sendCodeText = "已经发送 " + time + " S";
			// 			if (time <= 0) {
			// 				this.sendCodeText = '获取手机验证码';
			// 				this.isSendCode = false;
			// 				clearInterval(timeRange);
			// 			}
			// 		}, 1000);
			// 	}
			// }
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
				if(!this.isRegister) this.login();
			},
			// 限制验证发送和秒数显示
			sendCodeLimit(){
				let time = 30; //限制多少秒后可以重新发送手机验证码
				let timeRange = setInterval(() => {
					time--;
					this.sendCodeText = "已经发送 " + time + " S";
					if (time <= 0) {
						this.sendCodeText = '获取手机验证码';
						this.isSendCode = false;
						clearInterval(timeRange);
					}
				}, 1000);
			},
			//获取手机验证码
			phoneCode() {
				let {
					connectPhone,
					captcha
				} = this.userInfo; //用户输入的获取手机号，图形验证码

				if (captcha != '' && connectPhone != '') { //如果都不为空的时候，发送请求验证
					if (this.isSendCode == false) {
							this.api.phoneCodeApi({
								phone: connectPhone,
								code: captcha,
							}).then((data) => {
							
							if (data.code == "Ok" ) {
								this.$message.success("验证码发送成功");
								this.isSendCode = true;
								this.sendCodeLimit();
							} else {
								this.changeCaptcha(); //验证码输入错误后，验证码更换
								this.userInfo.captcha = ''; //验证码输入错误后，验证码输入框重置
								this.$message.warning(data.msg);
							}
						});
					} else {
						this.$message.error('验证码已发送，请勿重复发送');
					}

				} else {
					this.$message.error('手机号码和验证码不能为空');
				}

			},
			//获取 所辖区域请求
			getAreaData(){
				this.api.getAreaDataApi({}).then( res =>{
					this.areaList=res.data;
				});
			},
			//点击 去注册按钮 事件
			goRegister() {
				this.isRegister = !this.isRegister;
				this.captchaUrl = this.api.captchaApi(); //登录和注册界面切换后，验证码更换
				this.getAreaData();
				this.reset(); //重置
			},
			//用户注册
			register() {
				let isPassd = checkRegister(this.userInfo);
				if (isPassd) {
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
					} = this.userInfo;
					
					checkList=checkList.join(',');//数组转换成字符串
					
					this.api.registerApi({
						phoneCode: phoneCode,
						phone: connectPhone,
						name:account,
						contact:connectName,
						password:password,
						business:checkList,
						code:captcha,
						area:area
					}).then((res) => {
						console.log(res)
						if (res.code == "Ok") {
							this.$message.success('注册成功');
							this.isRegister=false;
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
			},
			//更改注册验证码图片
			changeCaptcha() {
				this.captchaUrl = this.api.captchaApi({});
			}
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

	/* 有选择性的修改输入框中左边标题颜色,
	*** @start:开始的位置,@end：结束的位置,@color：颜色 
	*/
	.toggleStatus(@start, @end, @color) when (@start <=@end) {

		&:nth-child(@{start}) .el-input-group__prepend,
		&:nth-child(@{start}) .el-input-group__append {
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
			.toggleStatus(4, 7, #ffb848);
			.toggleStatus(8, 8, white);
			.toggleStatus(9, 9, #407fdf);
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
		.area-box{
			display: flex;
			.bs-range{
				margin-left: 0;
			}
			.bs-range {
				flex: none;
			}
		}
		.bs-area-radio{
			width: 100%;
			display: flex;
			align-items: center;
			padding: 0 15px;
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

		.captcha {
			height: 34px;
			width: 70px;
			cursor: pointer;
		}
		
		
	}
</style>
