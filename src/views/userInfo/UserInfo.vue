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
								<p class='mes white' :class="{
										normal:certStatus,
										danger:userdata.statusCn=='已禁用'?true:false,
										waring:userdata.statusCn=='认证中'?true:false,
									}">
									{{userdata.statusCn}}
								</p>
							</el-col>
							<el-col :span="16" v-if="!remarkBox">
								<p class='mes red'>{{userdata.remark}}</p>
							</el-col>
						</el-row>
					</div>
					<!-- 信息表单 -->
					<div class="info-box">
						<!-- 用户信息表单组件 -->
						<formUserInfo :status="certStatus" :userdata="userdata" ref="modifyUerInfo"></formUserInfo>

						<el-alert :title="userdata.reason" type="warning" effect="dark"
							v-if="userdata.statusCn=='认证失败'?true :false" :closable="false">
						</el-alert>
						<div class="bottom-op">
							<el-col :span="12" v-if="!certStatus">
								<span>
									<el-checkbox v-model="agreeServe" label="同意" name="type"></el-checkbox><a
										href="/file/rzb.pdf" target="_blank">认证协议</a>
								</span>
							</el-col>
							<el-col :span="certStatus ? 24:12">
								<el-button type="primary" v-if="!certStatus" @click="submitForm()">
									{{userdata.statusCn=="认证失败"?"重新提交":"提交认证"}}</el-button>
								<!-- 	<el-button type="primary" v-if="certStatus" @click="changeUserInfoBtn()">信息更改
								</el-button> -->
							</el-col>
						</div>

					</div>
				</div>
			</el-col>

			<!-- 执照文件 -->
			<el-col :span="10">
				<div class="grid-content bg-purple-light">
					<div class="bs-license">
						<p>请上传营业执照文件</p>
						<el-upload action="#" list-type="picture-card" :limit="1" ref='bsUpload' accept=".jpg,.jepg,.png" :disabled="certStatus"
							:http-request="bsLicenseUpload" :before-upload="beforeUpload" :file-list="bsList">
							<i slot="default" class="el-icon-plus"></i>
							<div slot="file" slot-scope="{file}">
								<img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-preview"
										@click="handlePictureCardPreview(file,'bs')">
										<i class="el-icon-zoom-in"></i>
									</span>
									<span v-if="bs_disabled" class="el-upload-list__item-delete"
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
						<el-upload action="#" list-type="picture-card" :limit="1" ref='scUpload' accept=".jpg,.jepg,.png" :disabled="certStatus"
							:http-request="scLicenseUpload" :before-upload="beforeUpload" :file-list="scList">
							<i slot="default" class="el-icon-plus"></i>
							<div slot="file" slot-scope="{file}">
								<img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-preview"
										@click="handlePictureCardPreview(file,'sc')">
										<i class="el-icon-zoom-in"></i>
									</span>
									<span v-if="sc_disabled" class="el-upload-list__item-delete"
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

		<!-- 用户信息修改弹窗 -->
		<diglogUserInfoCg ref="diglogUserInfoCg" />

		<div class="guidelines" v-if="!certStatus">
			<el-col :span="24">
				<el-button type="warning" @click="guidelinesVisible = true">
					<i class="el-icon-edit-outline"></i>认证指引
				</el-button>
			</el-col>

			<el-dialog title="认证指引" :visible.sync="guidelinesVisible" width="70%" :modal-append-to-body='false'>
				<div class="guidelines-box">
					<img src="../../assets/home/rzzy.jpg">
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import PageHeader from '@/components/PageHeader'
	import formUserInfo from "./components/formUserInfo"
	import diglogUserInfoCg from "./components/diglogUserInfoCg"
	import {mapGetters,mapState} from "vuex"
	import {uploadCertFileApi,modifyRegistApi} from "@/request/api"
	import {isImgFormat,fileShowPath,throttle} from "@/utils"
	import { userInfoObj } from "@/utils/userInfo"

	export default {
		name: 'UserInfo',
		data() {
			return {
				certStatus: false,
				remarkBox:false,
				bs_dialogImageUrl: '', //放大照片的链接
				bs_dialogVisible: false, //放大查看照片的会话框
				bs_disabled: true, //是否显示上传照片中的放大、删除操作按钮

				sc_dialogImageUrl: '', //放大照片的链接
				sc_dialogVisible: false, //放大查看照片的会话框
				sc_disabled: true, //是否显示上传照片中的放大、删除操作按钮

				guidelinesVisible: false, //打开 认证指引 开关
				bs_certFile: '', //营业执照文件路径
				sc_certFile: '', //安全员执照文件路径
				bsList: [], //初始化的营业执照文件照片地址
				scList: [], //初始化的安全员执照文件照片地址

				agreeServe: false,
			}
		},
		computed: {
			...mapGetters(["isCertification"]),
			...mapState({
				userdata: state => {
					return {
						...state.userInfo
					}
				}
			})
		},
		methods: {
			//表单提交
			submitForm() {
				const userFormSubmit=()=>{
					let uerInfoComponent = this.$refs['modifyUerInfo']; //声明 表单组件
					
					uerInfoComponent.$refs['ruleForm'].validate((valid) => { //触发验证效果
						if (valid) { //如果表单验证通过
							if (this.agreeServe) { //如果已勾选 认证协议
								//获取用户输入的数据
								let postData=new userInfoObj(uerInfoComponent.ruleForm); 
								postData.business=JSON.stringify(postData.business);
								
								//整理认证接口的数据
								let formData = {
									id: this.userdata.id,
									certificate: this.bs_certFile, //营业执照文件
									safetyCertificate: this.sc_certFile, //安全员执照文件
								}
								//合并对象，如果键名相同，第二个参数覆盖第一个
								formData=Object.assign(formData,postData);
								
								//提交认证接口
								modifyRegistApi(formData).then((data) => {
									if (data.code == "20000") {
										let token = sessionStorage.getItem('token');
										this.$store.dispatch('authorityNav', token);
										this.$message.success("我公司将在3个工作日内完成认证工作，请您耐心等待。");
										this.agreeServe=false;
									} else {
										this.$message.error("认证失败");
										this.$router.go(0);
									}
								});
							} else {
								this.$message.warning("请勾选同意认证协议");
							}
						}
					});
				}
				
				throttle(userFormSubmit,2000);//节流函数，防止多次点击
			},
			//信息更改 按钮事件
			// changeUserInfoBtn() {
			// 	this.$refs["diglogUserInfoCg"].dialogFormVisible = true;
			// },
			//文件上传删除功能
			handleRemove(file, name) {
				let uploadFiles, index;
				// bs 是营业执照 标识，sc 是安全员执照 标识
				if (name == 'bs') {
					uploadFiles = this.$refs['bsUpload'].uploadFiles;
					this.bs_dialogImageUrl = '';
					this.bs_certFile = ''; //清除后台返回的文件链接
				} else if (name == 'sc') {
					uploadFiles = this.$refs['scUpload'].uploadFiles;
					this.sc_dialogImageUrl = '';
					this.sc_certFile = ''; //清除后台返回的文件链接
				}
				index = uploadFiles.indexOf(file);
				uploadFiles.splice(index, 1); //删除照片
			},
			//文件放大查看功能
			handlePictureCardPreview(file, name) {
				// bs 是营业执照 标识，sc 是安全员执照 标识
				if (name == 'bs') {
					this.bs_dialogImageUrl = file.url;
					this.bs_dialogVisible = true;
				} else if (name == 'sc') {
					this.sc_dialogImageUrl = file.url;
					this.sc_dialogVisible = true;
				}
			},
			//上传营业执照
			bsLicenseUpload(res) {
				let params = new FormData();
				params.append('file', res.file);

				uploadCertFileApi(params).then((data) => {
					if (data.code == "20000") {
						this.bs_certFile = data.data.certFile; //保存后台返回的 营业执照地址
					} else {
						this.$message.error("营业执照上传失败");
					}
				});
			},
			//上传安全员执照
			scLicenseUpload(res) {
				let params = new FormData();
				params.append('file', res.file);

				uploadCertFileApi(params).then((data) => {
					if (data.code == "20000") {
						this.sc_certFile = data.data.certFile; //保存后台返回的 营业执照地址
					} else {
						this.$message.error("安全员执照上传失败");
					}
				});
			},
			//上传前，校验是否为照片格式
			beforeUpload(file) {
				isImgFormat(file); //调用公共校验方法
			},
			//状态管理，不同状态控制要显示什么内容
			statusManagement(status){
				console.log(this.isCertification + ",状态下 ：", JSON.parse(JSON.stringify(this.userdata)));
				const fun={
					publicFun:()=>{//公共方法
						this.certStatus = true; //返回 true，禁用所有修改信息功能
						this.bs_disabled = false;//隐藏上传营业执照证件的删除按钮
						this.sc_disabled = false;//隐藏上传安全员执照证件的删除按钮
					},
					zhengchang:()=>{//正常 状态
						fun.publicFun();
						this.remarkBox=this.certStatus;//状态显示的右边 信息提示
					},
					yijingyong:()=>{//已禁用
						fun.publicFun();
						this.remarkBox=this.certStatus;
					},
					renzhengzhong:()=>{//认证中
						fun.publicFun();
						this.remarkBox= !this.certStatus;
					},
					weirenzheng:()=>{//未认证
						this.certStatus = false;
					},
					renzhengshibai:()=>{//认证失败
						this.certStatus = false;
					}
				}
				//map函数 不同状态 分配 对应的方法
				let enums =new Map([
					["正常",fun.zhengchang],
					["已禁用",fun.yijingyong],
					["认证中",fun.renzhengzhong],
					["未认证",fun.weirenzheng],
					["认证失败",fun.renzhengshibai]
				]);
				
				let targetFun=enums.get(status);
				targetFun();
			}
		},
		mounted() {
			this.bs_certFile = this.userdata.certificate || "";//营业执照路径
			this.sc_certFile = this.userdata.safetyCertificate || "";//安全员执照路径

			if(this.bs_certFile){//如果是空的时候，不给与初始值
				this.bsList = [{//营业执照文件照片初始值
					url: fileShowPath(this.bs_certFile, '')
				}]
			}
			
			if(this.sc_certFile){//如果是空的时候，不给与初始值
				this.scList = [{//安全员执照文件照片初始值
					url: fileShowPath(this.sc_certFile, '')
				}]
			}
			
			//状态管理，不同状态下控制显示的界面信息
			this.statusManagement(this.isCertification);
		},
		components: {
			PageHeader,
			formUserInfo,
			diglogUserInfoCg
		},
	}
</script>

<style lang="less">
	.userinfo-box {
		.el-input__inner{
			line-height: 1px !important;
		}
		.head-tip {
			.mes {
				background: #da9628;
				padding: 2px 0;
			}
			.normal {
				background: #27a9e3;
				padding: 2px 0;
			}
			.waring{
				background: #da9628;
				padding: 2px 0;
			}
			.danger {
				background: red;
				padding: 2px 0;
			}
		}

		.red {
			color: red;
		}

		.white {
			color: white;
		}

		.guidelines {
			margin-top: 100px;
			margin-left: 50px;
			text-align: left;

			.guidelines-box,
			.guidelines-box img {
				width: 100%;
				height: 100%;
			}
		}

		.bottom-op {
			margin-top: 10px;
			overflow: hidden;
			line-height: 40px;
		}
		
		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
		  -webkit-appearance: none;
		}
		input[type='number'] {
		  -moz-appearance: textfield;
		}

	}
</style>
