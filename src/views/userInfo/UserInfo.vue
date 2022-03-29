<template>
	<div class="userinfo-box">
		<!-- 主题内容顶部 -->
		<PageHeader :breadcrumbItem="$route.meta.headName" />
		<el-row>
			<el-col :span="14">
				<div class="grid-content bg-purple">
					<!-- 验证状态显示 -->
					<div class="head-tip">
						<el-row :gutter="20">
							<el-col :span="8">
								<p class='mes white'>{{certification}}</p>
							</el-col>
							<el-col :span="16">
								<p class='mes red'>请耐心等待工作人员认证</p>
							</el-col>
						</el-row>
					</div>
					<!-- 信息表单 -->
					<div class="info-box">
						<el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-position="left"
							label-width="120px" class="ruleForm">
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="客户名称" prop="userName">
										<el-input v-model.trim="ruleForm.userName"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="联系人" prop="contactName">
										<el-input v-model.trim="ruleForm.contactName"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="手机号" prop="cellPhone">
										<el-input oninput="value=value.replace(/[^0-9.]/g,'')"
											v-model="ruleForm.cellPhone"></el-input>
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
						<el-col :span="12">
							<span>
								<el-checkbox label="同意" name="type"></el-checkbox><a href="#">认证协议</a>
							</span>
						</el-col>
						<el-col :span="12">
							<el-button type="primary" @click="submitForm('ruleForm')">提交认证</el-button>
						</el-col>
						
					</div>
				</div>
			</el-col>

			<!-- 执照文件 -->
			<el-col :span="10">
				<div class="grid-content bg-purple-light">
					<div class="bs-license">
						<p>请上传营业执照文件</p>
						<el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1" ref='bsUpload'>
							<i slot="default" class="el-icon-plus"></i>
							<div slot="file" slot-scope="{file}">
								<img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file,'bs')">
										<i class="el-icon-zoom-in"></i>
									</span>
									<span v-if="!bs_disabled" class="el-upload-list__item-delete"
										@click="handleRemove(file,'bs')">
										<i class="el-icon-delete"></i>
									</span>
								</span>
							</div>
						</el-upload>
						
						<el-dialog :visible.sync="bs_dialogVisible" :modal-append-to-body="false">
						  <img width="100%" :src="bs_dialogImageUrl" alt="">
						</el-dialog>
					</div>

					<div class="sc-license">
						<p>请上传安全员执照文件</p>
						<el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="1" ref='scUpload'>
							<i slot="default" class="el-icon-plus"></i>
							<div slot="file" slot-scope="{file}">
								<img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file,'sc')">
										<i class="el-icon-zoom-in"></i>
									</span>
									<span v-if="!sc_disabled" class="el-upload-list__item-delete"
										@click="handleRemove(file,'sc')">
										<i class="el-icon-delete"></i>
									</span>
								</span>
							</div>
						</el-upload>
						<el-dialog :visible.sync="sc_dialogVisible" :modal-append-to-body="false">
							<img width="100%" :src="sc_dialogImageUrl" alt="">
						</el-dialog>
					</div>
				</div>
			</el-col>
		</el-row>
		<div class="guidelines">
			<el-col :span="24">
				<el-button type="warning" @click="guidelinesVisible = true">
					<i class="el-icon-edit-outline"></i>认证指引
				</el-button>
			</el-col>
			
			<el-dialog
			  title="认证指引"
			  :visible.sync="guidelinesVisible"
			  width="70%"
			  :modal-append-to-body='false'>
			  <div class="guidelines-box">
				  <img src="../../assets/home/rzzy.jpg" >
			  </div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import PageHeader from '@/components/PageHeader'
	export default {
		name: 'UserInfo',
		data() {
			return {
				certification: '未认证',
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
				bs_dialogImageUrl: '',//放大照片的链接
				bs_dialogVisible: false,//放大查看照片的会话框
				bs_disabled: false, //是否显示上传照片中的放大、删除操作按钮
				
				sc_dialogImageUrl: '',//放大照片的链接
				sc_dialogVisible: false,//放大查看照片的会话框
				sc_disabled: false,//是否显示上传照片中的放大、删除操作按钮
				
				guidelinesVisible:false,//打开 认证指引 开关
				
			
			}
		},
		methods: {
			//表单提交
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						console.log({
							...this.ruleForm
						})
					} else false
				});
			},
			//文件上传删除功能
			handleRemove(file,name) {
				let uploadFiles,index;
				// bs 是营业执照 标识，sc 是安全员执照 标识
				if(name=='bs'){
					uploadFiles=this.$refs['bsUpload'].uploadFiles;
					index =uploadFiles.indexOf(file);
					this.bs_dialogImageUrl = '';
				}else if(name=='sc'){
					uploadFiles=this.$refs['scUpload'].uploadFiles;
					this.sc_dialogImageUrl = '';
				}
				index =uploadFiles.indexOf(file);
				uploadFiles.splice(index,1);//删除照片
			},
			//文件放大查看功能
			handlePictureCardPreview(file,name) {
				 // bs 是营业执照 标识，sc 是安全员执照 标识
				if(name=='bs'){
					this.bs_dialogImageUrl = file.url;
					this.bs_dialogVisible = true;
				}else if(name=='sc'){
					this.sc_dialogImageUrl = file.url;
					this.sc_dialogVisible = true;
				}
			}
		},
		components: {
			PageHeader
		},
		mounted(){
			
		}
	}
</script>

<style lang="less">
	.head-tip .mes {
		background: #da9628;
		padding: 2px 0;
	}

	.red {
		color: red;
	}

	.white {
		color: white;
	}

	.guidelines{
		margin-top: 100px;
		margin-left: 50px;
		text-align: left;
		.guidelines-box,
		.guidelines-box img{
			width: 100%;
			height: 100%;
		}
	}
</style>
