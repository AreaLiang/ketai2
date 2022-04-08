<template>
	<div class="entrustDiglog">
		<el-dialog title="业务委托单" :visible.sync="dialogFormVisible"  :modal-append-to-body="false"  custom-class="entrust-diglog">
			<el-row :gutter="30" v-loading="loading" >
				<el-col :md="12" :lg="10">
					<el-form :model="addEntrustForm" label-position="top" ref="addEntrustForm" :rules="rules">
						<el-row :gutter="30">
							<el-col :span="12">
								<el-form-item label="委托单位" :label-width="formLabelWidth" >
									<el-input v-model="addEntrustForm.name" autocomplete="off" disabled></el-input>
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
								<el-form-item label="联系人 " :label-width="formLabelWidth" prop="contact">
									<el-input v-model="addEntrustForm.contact" autocomplete="off"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="联系手机号" :label-width="formLabelWidth" prop="contactCellphone">
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
								<el-upload  class="upload-UserInfoCg" ref="upload" action="#" 
									:limit="1" accept=".doc,.docx,.pdf" :before-upload="beforeLicenseUpload"
									:http-request="uploadLicense" style="margin: 10px 0;">
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
			<!-- 	<el-button @click="dialogFormVisible = false">取 消</el-button> -->
				<el-button type="primary" @click="addEntrust()">提交委托单</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { addEntrustOrderApi , uploadEntrustOrderApi} from "@/request/api.js"
	import {mapState} from 'vuex'
	import {baseUrl} from '@/request/api'
	import {fileShowPath} from '@/utils'
		
	export default {
		name: 'addEntrustDiglog', //新建业务委托 弹出框
		data() {
			return {
				dialogFormVisible: false,
				addEntrustForm: {
					name: '',
					adress: '',
					email: '',
					phone: '',
					contact: "",
					contactCellphone: '',
					remark: ''
				},
				rules:{
					contact: [{
							required: true,
							message: '请输入联系人',
							trigger: 'blur'
						}
					],
					contactCellphone: [{
						required: true,
						message: '请输入联系手机号',
						trigger: 'blur'
					}]
				},
				formLabelWidth: '120px',
				wordFile:'',
				ispdf:false,
				loading: false,
				wordUrl:''
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
		components: {
			
		},
		methods: {
			//确认添加业务委托
			addEntrust(){
				this.$refs['addEntrustForm'].validate((valid) => {
					if (valid) {//校验是否信息为空
						if(this.wordFile!=''){//校验是否上传委托文件
							let {contact,contactCellphone,remark}=this.addEntrustForm;
							let postData={
									contact:contact,
									mobile:contactCellphone,
									remark:remark,
									wordFile:'',
									orderFile:''
								}
							if(!this.ispdf){//判断是否pdf文件，如果是修改参数传值
								postData.wordFile=this.wordFile;
							}else{
								postData.orderFile=this.wordFile;
							}
							addEntrustOrderApi(postData).then((data)=>{
								console.log("新建委托单",data)
								if(data.code=="20000"){
									this.$message.success('新建成功!');
									this.dialogFormVisible = false;
									this.$bus.$emit('pageNumber',1);
								}else{
									this.$message.error('新建失败!');
								}
							});
						}else{
							this.$message.warning('请上传委托文件!');
						}
					} else false
				});
			},
			//上传证件文件前，对文件类型做判断
			beforeLicenseUpload(file) {
				const isPDF = file.type === 'application/pdf';
				const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
				const isDOC= file.type === 'application/msword';
			
				if (isDOCX || isDOC) {
					this.ispdf=false;
				}else if(isPDF){
					this.ispdf=true;
				} else {
					this.$message.error('只能是文档格式或者PDF格式!');
				}
			},
			//上传委托文件
			uploadLicense(res){
				this.loading=true;//加载图标开启
				
				//转换formdata格式
				let params = new FormData();
				params.append('file', res.file);
				
				//调用接口上传证件
				uploadEntrustOrderApi(params).then((data) => {
					console.log(data.data.wordFile)
					if(data.code=="20000"){
						this.loading=false;//关闭 加载图标
						this.wordFile = data.data.wordFile;
						// this.wordUrl=fileShowPath(data.data.wordFile);
					}else{
						this.loading=false;
						this.$message.error('上传失败!');
					}
				})
				
			}
		},
		mounted() {
			//渲染数据
			let {name,address,email,phone,contact,mobile}=this.userdata;
			this.addEntrustForm.name=name;
			this.addEntrustForm.adress=address;
			this.addEntrustForm.email=email;
			this.addEntrustForm.phone=phone;
			this.addEntrustForm.contact=contact;
			this.addEntrustForm.contactCellphone=mobile;
		}

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
			width: 75%;
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
