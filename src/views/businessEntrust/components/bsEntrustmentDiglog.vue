<template>
	<div class="bsEntrustmentDiglog">
		<el-dialog title="业务委托单" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
			:modal-append-to-body="false" custom-class="entrust-diglog">
			<div v-loading="loading">
				<el-row :gutter="30">
					<el-col :md="12" :lg="10">
						<el-form :model="addEntrustForm" label-position="top" ref="addEntrustForm" :rules="rules">
							<el-row :gutter="30">
								<el-col :span="12">
									<el-form-item label="委托单位" :label-width="formLabelWidth">
										<el-input v-model="addEntrustForm.name" autocomplete="off" disabled></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="公司地址" :label-width="formLabelWidth">
										<el-input v-model="addEntrustForm.address" autocomplete="off" disabled>
										</el-input>
									</el-form-item>
								</el-col>
							</el-row>

							<el-row :gutter="30">
								<el-col :span="12">
									<el-form-item label="电子邮箱" :label-width="formLabelWidth">
										<el-input v-model="addEntrustForm.email" autocomplete="off" disabled></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="公司座机" :label-width="formLabelWidth">
										<el-input v-model="addEntrustForm.phone" autocomplete="off" disabled></el-input>
									</el-form-item>
								</el-col>
							</el-row>

							<el-row :gutter="30">
								<el-col :span="12">
									<el-form-item label="联系人" :label-width="formLabelWidth" prop="contact">
										<el-input v-model.trim="addEntrustForm.contact" maxlength="6"
											autocomplete="off"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="联系手机号" :label-width="formLabelWidth" prop="mobile">
										<el-input v-model="addEntrustForm.mobile" type="number" autocomplete="off">
										</el-input>
									</el-form-item>
								</el-col>
							</el-row>

							<el-row>
								<el-col :span="24">
									<el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
										<el-input type="textarea" v-model="addEntrustForm.remark" :rows="8"></el-input>
									</el-form-item>
								</el-col>
							</el-row>

							<el-row>
								<el-col :span="24">
									<el-upload class="upload-UserInfoCg" ref="uploadUserInfoCg" action="#"
										accept=".doc,.docx" :before-upload="beforeLicenseUpload"
										:http-request="uploadLicense" :file-list="fileList" style="margin: 25px 0;">
										<el-button slot="trigger" size="small" type="primary">委托文件</el-button>
									</el-upload>
								</el-col>
							</el-row>
						</el-form>
					</el-col>

					<el-col :md="12" :lg="14">
						<div class="pdfShow">
							<iframe class="pdf-show" :src="wordUrl" width="100%" height="460"></iframe>
						</div>
					</el-col>
				</el-row>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="addEntrust()">提交委托单</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		addEntrustOrderApi,
		uploadEntrustOrderApi,
		modifyEntrustOrderApi
	} from "@/request/api"
	import {
		mapState
	} from 'vuex'
	import {
		baseUrl
	} from '@/request/api'
	import {
		fileShowPath,
		formValidation,
		throttle
	} from '@/utils'
	import {
		entrustObj
	} from '@/utils/bsEntrust'

	export default {
		name: 'bsEntrustmentDiglog', //新建业务委托 弹出框
		data() {
			return {
				dialogFormVisible: false,
				operateType: 1, //弹窗类型，1为新建委托，0为 修改委托、编辑委托
				addEntrustForm: {
					name: '',
					address: '',
					email: '',
					phone: '',
					contact: "",
					mobile: '',
					remark: ''
				},
				rules: {
					contact: [{
						required: true,
						message: '请输入联系人',
						trigger: 'blur'
					}],
					mobile: [{
							required: true,
							message: '请输入联系手机号',
							trigger: 'blur',
						},
						{
							validator: formValidation.mobile,
							trigger: 'blur'
						}
					],
					remark: [{
						max: 120,
						message: '长度不能超过120个字符',
						trigger: 'blur'
					}]
				},
				formLabelWidth: '120px',
				wordFile: '',
				loading: false,
				wordUrl: '',
				rowData: {},
				fileList: []
			}
		},
		watch: {
			dialogFormVisible: function() { //监听弹窗的变化
				if (this.dialogFormVisible) {
					this.$nextTick(() => {
						this.$refs['uploadUserInfoCg'].clearFiles(); //清空上传文件的列表
						this.$refs['addEntrustForm'].clearValidate(); //移除表单验证结果
						this.wordUrl = '';
					});
					let userData = JSON.parse(JSON.stringify(this.userdata));
					
					this.addEntrustForm = Object.assign(this.addEntrustForm, userData, this.rowData);
				
					if(!this.rowData.remark){//如果点解新建委托，则没有数据，说明是新建委托单
						this.addEntrustForm.remark='';
					}

					if (this.isCreatedOrder) { //修改业务委托 表单信息
						let jsonData = JSON.parse(JSON.stringify(this.rowData));
						if (jsonData.rawData.orderFilePdf) { //如果证件的路径不为空
							this.$nextTick(() => { //如果已经上传了委托文件，则赋值路径显示文件内容
								this.fileList = [];
								let orderFilePdf = jsonData.rawData.orderFilePdf;
								this.wordUrl = fileShowPath(orderFilePdf, 'pdf');
								this.wordFile = orderFilePdf;
								this.fileList.push({
									name: orderFilePdf,
									url: fileShowPath(orderFilePdf, 'pdf')
								});
							})
						}
					}
				}
			}
		},
		computed: {
			...mapState({
				userdata: state => {
					return {
						...state.userInfo
					}
				}
			})
		},
		props: {
			isCreatedOrder: { //是否已经创建过业务委托，如果创建过，需要显示之前创建的信息，则设置为true
				type: Boolean,
				default: false
			}
		},
		methods: {
			//确认添加业务委托
			addEntrust() {
				this.$refs['addEntrustForm'].validate((valid) => {
					if (valid) { //校验是否信息为空

						if (this.wordFile != '') { //校验是否上传委托文件
							this.loading = true;
							let postData = new entrustObj(this.addEntrustForm); //委托单需要的信息

							postData.wordFile=this.wordFile;
							
							//执行提交业务委托的 事件接口
							this.$emit('subEntrust', {
								obj: this,
								postData: postData
							});

						} else {
							this.$message.warning('请上传委托文件!');
						}
					} else false
				});
			},
			
			//上传证件文件前，对文件类型做判断
			beforeLicenseUpload(file) {
				const isPDF = file.type === 'application/pdf';
				const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
				const isDOC = file.type === 'application/msword';
				let uploadFiles = this.$refs['uploadUserInfoCg'].uploadFiles;
				if (uploadFiles.length > 1) {
					uploadFiles.splice(0, 1); //删除照片
				}

				if(isPDF || isDOCX || isDOC){
					return true
				}else{
					this.$message.error('只能是文档格式或者PDF格式!');
					return false
				}
			},
			//上传委托文件
			uploadLicense(res) {
				this.loading = true; //加载图标开启
				
				//转换formdata格式
				let params = new FormData();
				params.append('file', res.file);

				//调用接口上传证件
				uploadEntrustOrderApi(params).then((data) => {

					if (data.code == "20000") {
						this.loading = false; //关闭 加载图标
						this.wordFile = data.data.wordFile;
						this.wordUrl = fileShowPath(data.data.wordFile, 'pdf');
					
					} else {
						this.loading = false;
						this.$message.error('上传失败!');
					}
				})
			}
		},

	}
</script>

<style lang="less">
	.bsEntrustmentDiglog {
		.el-upload-list__item {
			transition: none;
		}

		.el-input__inner {
			line-height: 1px !important;
		}

		input::-webkit-inner-spin-button {
			-webkit-appearance: none !important;
		}

		input::-webkit-outer-spin-button {
			-webkit-appearance: none !important;
		}

		input[type="number"] {
			-moz-appearance: textfield;
		}

		.el-form-item {
			text-align: left;
			margin-bottom: 0;
		}

		.el-form--label-top .el-form-item__label {
			padding: 0;
		}

		.entrust-diglog {
			width: 75%;

			.el-upload-list--text {
				overflow: hidden;
				height: 30px;
			}
		}

		.pdfShow {
			background: #ccc;
			height: 460px;
		}

		.upload-entrust {
			height: 38px;
			margin: 10px 0;
			min-width: 328px;
		}

		.el-upload-list__item:first-child,
		.el-upload-list__item {
			margin: 0;
		}

		.el-upload {
			width: 20%;
		}

		.el-upload-list {
			display: inline-block;
			width: 70%;
			vertical-align: middle;
			margin-left: 20px;
		}
	}
</style>
