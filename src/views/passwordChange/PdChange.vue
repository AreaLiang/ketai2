<<<<<<< HEAD
<template>
	<div class="password-change">
		<!-- 主题内容顶部 -->
		<PageHeader :breadcrumbItem="$route.meta.headName" />
		
		<div class="password-box">
			<el-col :span='10'>
				<el-form ref="passlist" :model="passlist" label-width="80px" :rules="rules">
					<el-form-item label="原始密码" prop="ogPass">
						<el-input type="password" v-model="passlist.ogPass"></el-input>
					</el-form-item>
					<el-form-item label="新密码" prop="newPass">
						<el-input type="password" v-model="passlist.newPass"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="checkPass">
						<el-input type="password" v-model="passlist.checkPass"></el-input>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="24">
				<div class="op-btn-box">
					<el-button type="primary">提交密码更改</el-button>
				</div>
			</el-col>
		</div>
	</div>
</template>

<script>
	import PageHeader from '@/components/PageHeader'
	export default {
		name: 'PdChange',
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.passlist.checkPass !== '') {
						this.$refs.passlist.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.passlist.newPass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				passlist: {
					ogPass: '',
					newPass: '',
					checkPass: ''
				},
				rules: {
					newPass: [{
						required: true,
						validator: validatePass,
						trigger: 'blur'
					}],
					checkPass: [{
						required: true,
						validator: validatePass2,
						trigger: 'blur'
					}],
					ogPass: [{
						required: true,
						message: '请输原始密码',
						trigger: 'blur'
					}],
				},
			}
		},
		components: {
			PageHeader
		},
		mounted() {
		
		}
	}
</script>

<style scoped lang="less">
	.password-box {
		margin: 50px 0 0 20px;
	}

	.op-btn-box {
		overflow: hidden;
		margin-top: 100px;
	}
</style>
=======
<template>
	<div class="password-change">
		<!-- 主题内容顶部 -->
		<PageHeader :breadcrumbItem="$route.meta.headName" />
		<div class="password-box">
			<el-col :span='10'>
				<el-form :model="passlist" ref="pdForm" label-width="80px" :rules="rules">
					<el-form-item label="原始密码" prop="ogPass">
						<el-input type="password" v-model.trim="passlist.ogPass"  maxlength="16" clearable></el-input>
					</el-form-item>
					<el-form-item label="新密码" prop="newPass">
						<el-input type="password" v-model.trim="passlist.newPass"  maxlength="16" clearable></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="checkPass">
						<el-input type="password" v-model.trim="passlist.checkPass"  maxlength="16" clearable></el-input>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span="24">
				<div class="op-btn-box">
					<el-button type="primary" @click="changeFun('pdForm')">提交密码更改</el-button>
				</div>
			</el-col>
		</div>
	</div>
</template>

<script>
	import PageHeader from '@/components/PageHeader'
	import NProgress from 'nprogress' // 引入头部进度条
	import {removeSessionStorage,throttle} from "@/utils"
	import {pdChangeApi} from "@/request/api"
	import {resetRouter} from '@/router'
	export default {
		name: 'PdChange',
		data() {
			var validatePass = (rule, value, callback) => {//原密码检验规则
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if(value.length >= 6 && value.length <= 16){
						if (this.passlist.checkPass !== '') {
							this.$refs.pdForm.validateField('checkPass');
						}
						callback();
					}else callback(new Error('请输入6到16位的字符'));
					
				}
			};
			var validatePass2 = (rule, value, callback) => {//二次密码校验规则
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.passlist.newPass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				passlist: {
					ogPass: '', //原密码
					newPass: '', //新密码
					checkPass: '' //再次输入密码
				},
				rules: {
					newPass: [{
						required: true,
						validator: validatePass,
						trigger: 'blur'
					}],
					checkPass: [{
						required: true,
						validator: validatePass2,
						trigger: 'blur'
					}],
					ogPass: [{
						required: true,
						message: '请输原始密码',
						trigger: 'blur'
					}],
				},
			}
		},
		components: {
			PageHeader
		},
		methods: {
			changeFun:throttle(function(formName) {
				this.$refs[formName].validate((valid) => {
					let {
						ogPass,
						newPass
					} = this.passlist;

					if (valid) {
						//调用修改密码接口
						pdChangeApi({
							oldpwd: ogPass,
							pwd: newPass
						}).then((data) => {
							if (data.code == "Ok" ) {
								this.$message.success("修改成功,3秒后将重新登录");
								NProgress.start() //开启进度条
								//进度条 的进度设置
								let time = 0;
								let np = setInterval(() => {
									time = time + 0.2;
									NProgress.set(0.3 + time);
								}, 1000)

								//修改成功后3秒自动专题登陆页面
								setTimeout(() => {
									removeSessionStorage('token'); //删除缓存
									NProgress.done();
									clearInterval(np);
									this.$router.push("/Login");
									resetRouter(); //路由重置
								}, 3000)
							} else {
								this.$message.error(data.msg);
							}
						}).catch((e) => "未知异常错误，请联系客服");
					}
				});
			},3000)
		}
	}
</script>

<style scoped lang="less">
	.password-box {
		margin: 50px 0 0 20px;
	}

	.op-btn-box {
		overflow: hidden;
		margin-top: 100px;
	}
</style>
>>>>>>> main
