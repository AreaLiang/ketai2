<template>
	<div class="userInfo-form">
		<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-position="left" label-width="120px"
			class="ruleForm" :disabled="certStatus">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="客户名称" prop="userName" >
						<el-input v-model.trim="ruleForm.userName" :disabled="dialogFormVisible"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="联系人" prop="contactName">
						<el-input v-model.trim="ruleForm.contactName"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="手机号" prop="cellPhone">
						<el-input oninput="value=value.replace(/[^0-9.]/g,'')" v-model="ruleForm.cellPhone"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="联系电话(座机)">
						<el-input v-model.number="ruleForm.phone"></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item label="电子邮箱" prop="mail">
						<el-input v-model.trim="ruleForm.mail"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="公司地址" prop="address">
						<el-input v-model.trim="ruleForm.address"></el-input>
					</el-form-item>
				</el-col>

				<el-col :span="24">
					<el-form-item label="业务需求" prop="profession">
						<el-checkbox-group v-model="ruleForm.profession" style="text-align: left;">
							<el-checkbox label="铝型材" name="aluminum"></el-checkbox>
							<el-checkbox label="陶瓷" name="ceramics"></el-checkbox>
							<el-checkbox label="汽配" name="autoParts"></el-checkbox>
							<el-checkbox label="电子" name="electronic"></el-checkbox>
							<el-checkbox label="危化品" name="hazardous"></el-checkbox>
							<el-checkbox label="水泥" name="cement"></el-checkbox>
							<el-checkbox label="印染" name="printing"></el-checkbox>
							<el-checkbox label="其他" name="other"></el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item label="安全管理员" prop="securityName">
						<el-input v-model.trim="ruleForm.securityName"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="安全员手机号" prop="securityPhone">
						<el-input v-model.number="ruleForm.securityPhone"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script>
	import { userformInfo } from "@/utils/userInfo"
	export default {
		name: 'formUserInfo', //用户信息表单
		data() {
			return {
				certStatus: false,
				ruleForm: {
					userName: '',
					contactName: '',
					cellPhone: '',
					phone: '',
					mail: '',
					address: '',
					profession: [],
					securityName: '',
					securityPhone: ''
				},
				rules: {
					userName: [{
							required: true,
							message: '请输入名称',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 6,
							message: '长度在 2 到 6 个字符',
							trigger: 'blur'
						}
					],
					contactName: [{
						required: true,
						message: '请输入联系人',
						trigger: 'blur'
					}],
					cellPhone: [{
							required: true,
							message: '请输入手机号',
							trigger: 'blur'
						},
						{
							min: 11,
							max: 11,
							message: '请输入11位手机号',
							trigger: 'blur'
						}
					],
					profession: [{
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
					mail: [{
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
					securityName: [{
						required: true,
						message: '请输入安全管理员名称',
						trigger: 'blur'
					}],
					securityPhone: [{
						required: true,
						message: '请输入安全员手机号',
						trigger: 'blur'
					}]
				},
			}
		},
		methods: {
			
		},
		computed: {

		},
		components: {

		},
		props: ['status', 'userdata','dialogFormVisible'],
		mounted() {
			this.$nextTick(function() {
					this.certStatus = this.status;
					this.ruleForm=userformInfo(this.userdata);
				}
			)
		}
	}
</script>

<style scoped lang="less">

</style>
