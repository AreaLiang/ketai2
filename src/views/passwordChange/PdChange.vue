<template>
	<div class="password-change">
		<!-- 主题内容顶部 -->
		<PageHeader :breadcrumbItem="$route.meta.headName" />

		<div class="password-box">
			<el-col :span='10'>
				<el-form :model="passlist" ref="pdForm" label-width="80px" :rules="rules">
					<el-form-item label="原始密码" prop="ogPass">
						<el-input type="password" v-model.trim="passlist.ogPass"></el-input>
					</el-form-item>
					<el-form-item label="新密码" prop="newPass">
						<el-input type="password" v-model.trim="passlist.newPass"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="checkPass">
						<el-input type="password" v-model.trim="passlist.checkPass"></el-input>
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
	import {
		removeSessionStorage,
		throttle
	} from "@/utils"
	import {
		pdChangeApi
	} from "@/request/api"
	import {
		resetRouter
	} from '@/router'
	export default {
		name: 'PdChange',
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if(value.length >= 6 && value.length <= 18){
						if (this.passlist.checkPass !== '') {
							this.$refs.pdForm.validateField('checkPass');
						}
						callback();
					}else callback(new Error('请输入6到18位的字符'));
					
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
			changeFun(formName) {

				this.$refs[formName].validate((valid) => {
					let {
						ogPass,
						newPass
					} = this.passlist;

					if (valid) {
						const pdChangeFun = () => {
							//调用修改密码接口
							pdChangeApi({
								oldpwd: ogPass,
								pwd: newPass
							}).then((data) => {
								if (data.code == "20000") {
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

									//清空表单
									this.$refs[formName].resetFields()
								}
							}).catch((e) => "未知异常错误，请联系客服");
						}

						throttle(pdChangeFun); //节流函数
					}
				});
			}
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
