<template>
	<div class="entrustDiglog">
		<el-dialog title="业务委托单" :visible.sync="dialogFormVisible" :modal-append-to-body="false"  custom-class="entrust-diglog">
			<el-row :gutter="30">
				<el-col :span="12">
					<el-form :model="addEntrustForm" label-position="top">
						<el-row :gutter="30">
							<el-col :span="12">
								<el-form-item label="委托单位" :label-width="formLabelWidth" >
									<el-input v-model="addEntrustForm.entrustCompany" autocomplete="off" disabled></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="公司地址" :label-width="formLabelWidth">
									<el-input v-model="addEntrustForm.adress" autocomplete="off" disabled></el-input>
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
								<el-form-item label="联系人 " :label-width="formLabelWidth">
									<el-input v-model="addEntrustForm.contact" autocomplete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="联系手机号" :label-width="formLabelWidth">
									<el-input v-model="addEntrustForm.contactCellphone" autocomplete="off"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					
						<el-row>
							<el-col :span="24">
								<el-form-item label="备注" :label-width="formLabelWidth">
									<el-input type="textarea" v-model="addEntrustForm.remark" :rows="8"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						
						<el-row>
							<el-col :span="24">
								<el-upload class="upload-UserInfoCg" ref="upload" action="#" 
									:limit="1" accept=".jpg,.jpeg,.png" :before-upload="beforeLicenseUpload"
									:http-request="uploadLicense">
									<el-button slot="trigger" size="small" type="primary">点击上传</el-button>
								</el-upload>
							</el-col>
						</el-row>
					</el-form>
				</el-col>
				
				<el-col :span="12">
					<div class="pdfShow"></div>
				</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
			<!-- 	<el-button @click="dialogFormVisible = false">取 消</el-button> -->
				<el-button type="primary" @click="addEntrust()">提交委托单</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { addEntrustOrderApi } from "@/request/api.js"
	import {getBase64} from "@/utils"
	export default {
		name: 'addEntrustDiglog', //新建业务委托 弹出框
		data() {
			return {
				dialogFormVisible: false,
				addEntrustForm: {
					entrustCompany: '',
					adress: '',
					email: '',
					phone: '',
					contact: "",
					contactCellphone: '',
					remark: ''
				},
				formLabelWidth: '120px'
			}
		},
		components: {

		},
		methods: {
			handleChange() {
				
			},
			addEntrust(){
				this.dialogFormVisible = false;
				
				let {contact,contactCellphone,remark}=this.addEntrustForm;
				
				// addEntrustOrderApi({
				// 	contact:'',
				// 	mobile:'',
				// 	remark:'',
				// 	wordFile:'',
				// 	orderFile:''
				// }).then((data)=>{
				// 	console.log("新建委托单",data)
				// });
			},
			//上传证件文件前，对文件类型做判断
			beforeLicenseUpload(file) {
				const isJEPG = file.type === 'image/jpeg';
				const isJPG = file.type === 'image/jpg';
				const isPNG = file.type === 'image/png';
			
				if (isJEPG || isJPG || isPNG) {
					return true
				} else {
					this.$message.error('上传头像图片只能是 JPG 格式!');
					return false
				}
			},
			uploadLicense(res){
				//照片转base64格式
				getBase64(res.file).then((data)=>{
					this.licenseUrl=data;
				});
					
				let params = new FormData();
				params.append('file', res.file);
				
				//调用接口上传证件
				addEntrustOrderApi(params).then((data) => {
					console.log(data)
					// this.certFile = data.data.certFile;
				})
			}
		},
		mounted() {

		},

	}
</script>

<style lang="less">
	.entrustDiglog {
		.el-form-item{
			text-align: left;
			margin-bottom: 0;
		}
		.el-form--label-top .el-form-item__label{
			padding: 0;
		}
		.entrust-diglog{
			width: 60%;
		}
		.pdfShow{
			background: #ccc;
			height: 460px;
		}
			
		.upload-entrust{
			height: 38px;
			margin: 10px 0;
			min-width: 328px;
		}
		.el-upload-list__item:first-child,
		.el-upload-list__item{
			margin: 0;
		}
		.el-upload{
			width: 20%;
		}
		.el-upload-list{
			display: inline-block;
			width: 70%;
			vertical-align: middle;
			margin-left: 20px;
		}
	}
	
</style>
