<template>
	<div class="register">
		<div class="input-item">
			<el-input placeholder="请输入公司全称" maxlength="32" show-word-limit v-model.trim="userInfo.account" v-focus>
				<template slot="prepend">
					<span>客户名称</span>
				</template>
			</el-input>
		</div>
		<div class="input-item">
			<el-input placeholder="请输入登录密码" maxlength="16" v-model.trim="userInfo.password" type="password"
				@keyup.enter.native="keyupLogin">
				<template slot="prepend">
					<span>登录密码</span>
				</template>
			</el-input>
		</div>
		<div class="input-item">
			<el-input placeholder="请再次输入登录密码" maxlength="16" v-model.trim="userInfo.passwordAgain" type="password">
				<template slot="prepend">
					<span>确认密码</span>
				</template>
			</el-input>
		</div>
		<div class="input-item">
			<el-input placeholder="请输入联系人姓名" maxlength="6" show-word-limit v-model.trim="userInfo.connectName">
				<template slot="prepend">
					<span>联系人</span>
				</template>
			</el-input>
		</div>
		<div class="input-item">
			<el-input placeholder="请输入联系手机号" v-model.trim="userInfo.connectPhone" type="number" class="no-number">
				<template slot="prepend">
					<span>联系手机号</span>
				</template>
			</el-input>
		</div>
		<div class="input-item">
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

		<div class="input-item">
			<div class="area-box">
				<div class="bs-range bs-item">
					<span>所辖区域</span>
				</div>
				<div class="bs-area-radio bs-item">
					<el-radio-group v-model="userInfo.area">
						<el-radio :label="p.id" v-for="(p,index) in areaList" :key="index" style="color: white">
							{{p.name}}
						</el-radio>
					</el-radio-group>
				</div>
			</div>
		</div>

		<div class="input-item">
			<el-input placeholder="请输入验证码" maxlength="5" v-model.trim="userInfo.captcha">
				<template slot="prepend">
					<img :src="captchaUrl" @click="changeCaptcha()" class="captcha" alt="">
				</template>
			</el-input>
		</div>
		<div class="input-item">
			<el-input type="number" placeholder="手机验证码" v-model.trim="userInfo.phoneCode" class="phoneCode no-number">
				<template slot="append">
					<el-button @click="phoneCode()" :disabled="isSendCode" v-throttle>{{sendCodeText}}</el-button>
				</template>
			</el-input>
		</div>
	</div>
</template>

<script>
	
	export default {
		name: 'register',
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
					checkList: [],
					area: ''
				},
				captchaUrl: '', //验证码图片地址
				sendCodeText: '获取手机验证码', //获取手机验证码文字显示
				isSendCode: false, //是否已经发送验证码
				areaList: [] //所辖区域集合
			}
		},
		watch: {
			isRegister: function(val) {
				if (val) {
					this.changeCaptcha();
				}
			}
		},
		methods: {
			// 限制验证发送和秒数显示
			sendCodeLimit() {
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

							if (data.code == "Ok") {
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
			//更改注册验证码图片
			changeCaptcha() {
				this.captchaUrl = this.api.captchaApi({});
			},
			//获取 所辖区域请求
			getAreaData() {
				this.api.getAreaDataApi({}).then(res => {
					this.areaList = res.data;
				});
			}
		},
		mounted() {
			this.getAreaData();
			this.changeCaptcha(); //登录和注册界面切换后，验证码更换
		}
	}
</script>

<style scoped lang="less">
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

	.register {
	
		/deep/.input-item{
			.toggleStatus(1, 3, #28b779);
			.toggleStatus(4, 5, #ffb848);
			.toggleStatus(8, 8, white);
			.toggleStatus(9, 9, #407fdf);
		}
		overflow: hidden;
	}

	.bs-range {
		height: 40px;
		line-height: 40px;
		.modifyEl-input(#ffb848);
		border-radius: 4px 0 0 4px;
		padding: 0 20px;
		vertical-align: middle;
		position: relative;
		margin: 0 auto;
	}

	.area-box {
		display: flex;

		.bs-range {
			margin-left: 0;
		}

		.bs-range {
			flex: none;
		}
	}

	.bs-area-radio {
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

	.captcha {
		height: 34px;
		width: 70px;
		cursor: pointer;
	}

	.el-checkbox {
		color: white;
	}
</style>
