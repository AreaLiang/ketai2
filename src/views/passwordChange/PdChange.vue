<template>
	<div class="password-change">
		<!-- 主题内容顶部 -->
		<PageHeader :breadcrumbItem="breadcrumbItem" />
		
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
				breadcrumbItem:[]//头部面包屑内容，如 密码更改/密码录入
			}
		},
		components: {
			PageHeader
		},
		mounted() {
			this.breadcrumbItem=this.$route.meta.headName;
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
