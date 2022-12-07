<template>
	<div class="userInfo-form">
		<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-position="left" label-width="120px"
			class="ruleForm" :disabled="certStatus">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="客户名称" prop="name" >
						<el-input v-model.trim="ruleForm.name" maxlength="20" show-word-limit :disabled="dialogFormVisible"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="联系人" prop="contact">
						<el-input v-model.trim="ruleForm.contact" maxlength="6"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="手机号" prop="mobile">
						<el-input oninput="value=value.replace(/[^0-9.]/g,'')" v-model="ruleForm.mobile"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="联系电话(座机)" prop="phone" >
						<el-input v-model="ruleForm.phone" ></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item label="电子邮箱" prop="email">
						<el-input v-model.trim="ruleForm.email"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="公司地址" prop="address">
						<el-input v-model.trim="ruleForm.address"  maxlength="30"></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="24">
					<el-form-item label="业务需求" prop="business">
						<el-checkbox-group v-model="ruleForm.business" style="text-align: left;">
							<el-checkbox label="铝型材" name="profession"></el-checkbox>
							<el-checkbox label="陶瓷" name="profession"></el-checkbox>
							<el-checkbox label="汽配" name="profession"></el-checkbox>
							<el-checkbox label="电子" name="profession"></el-checkbox>
							<el-checkbox label="危化品" name="profession"></el-checkbox>
							<el-checkbox label="水泥" name="profession"></el-checkbox>
							<el-checkbox label="印染" name="profession"></el-checkbox>
							<el-checkbox label="其他" name="profession"></el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="安全管理员" prop="safetyOfficer">
						<el-input v-model.trim="ruleForm.safetyOfficer"  maxlength="6"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="安全员手机号" prop="safetyMobile">
						<el-input v-model.number="ruleForm.safetyMobile" type="number" ></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script>
	import { userformInfo } from "../js/userInfo"
	import { getBase64,formValidation } from "@/utils"
	export default {
		name: 'formUserInfo', //用户信息表单
		data() {
			return {
				certStatus: false,
				ruleForm: {
					name: '',
					contact: '',
					mobile: '',
					phone: '',
					email: '',
					address: '',
					business: [],
					safetyOfficer: '',
					safetyMobile: ''
				},
				rules: {
					name: [{
							required: true,
							message: '请输入名称',
							trigger: 'blur'
						}
					],
					contact: [{
						required: true,
						message: '请输入联系人',
						trigger: 'blur'
					}],
					mobile: [{
							required: true,
							message: '请输入手机号',
							trigger: 'blur'
						},
						{
							validator: formValidation.mobile,
							trigger: 'blur'
						}
					],
					business: [{
						type: 'array',
						required: true,
						message: '请至少选择业务',
						trigger: 'change'
					}],
					type: [{
						type: 'array',
						required: true,
						message: '请至少选择一个活动性质',
						trigger: 'blur'
					}],
					email: [{
						required: true,
						message: '请输入电子邮箱',
						trigger: 'blur'
					}, {
						type: 'email',
						message: '邮箱格式不对',
						trigger: 'blur'
					}],
					address: [{
						required: true,
						message: '请填写公司地址',
						trigger: 'blur'
					}],
					phone:[{
						required: true,
						message: '请填写公司电话',
						trigger: 'blur'
					},
					{
						validator: formValidation.phone,
						trigger: 'blur'
					}],	
					safetyOfficer: [{
						message: '请输入安全管理员名称',
						trigger: 'blur'
					}],
					safetyMobile: [
					{	
						validator: formValidation.mobile,
						trigger: 'blur',
						message: '请输入正确的11位手机号',
					}]
				},
				
			}
		},
		methods: {
			submit(){
				let isPass;
				this.$refs['ruleForm'].validate((valid) => {
					if (valid) {//如果表单验证全部通过
						isPass= true
					} else {
						isPass=false
					}
				});
				return isPass;
			}
		},
		props: ['status', 'userdata','dialogFormVisible'],
		mounted() {
			this.$nextTick(function() {
					this.certStatus = this.status;
					this.ruleForm=userformInfo(this.userdata);//业务范围转中文格式数组
				}
			)
		}
	}
</script>

