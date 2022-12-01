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
										normal:statusList.formDisable,
										danger:userdata.status=='YiJinYong'?true:false,
										waring:userdata.status=='RenZhengZhong'?true:false,
									}">
									{{userdata.statusCn}}
								</p>
							</el-col>
							<el-col :span="16" v-if="statusList.remarkBox">
								<p class='mes red'>{{userdata.remark}}</p>
							</el-col>
						</el-row>
					</div>
					<!-- 信息表单 -->
					<div class="info-box">
						<!-- 用户信息表单组件 -->
						<formUserInfo :status="statusList.formDisable" :userdata="userdata" ref="modifyUerInfo"></formUserInfo>

						<el-alert :title="userdata.reason" type="warning" effect="dark"
							v-if="userdata.status=='RenZhengShiBai'?true :false" :closable="false">
						</el-alert>
						<div class="bottom-op">
							<el-col :span="12" v-if="!statusList.formDisable">
								<span>
									<el-checkbox v-model="agreeServe" label="同意" name="type"></el-checkbox><a
										href="/file/rzb.pdf" target="_blank">认证协议</a>
								</span>
							</el-col>
							<el-col :span="statusList.formDisable ? 24:12">
								<el-button type="primary" v-if="!statusList.formDisable" @click="submitForm()">
									{{userdata.status=="RenZhengShiBai"?"重新提交":"提交认证"}}
								</el-button>
							</el-col>
						</div>

					</div>
				</div>
			</el-col>

			<!-- 执照文件 -->
			<el-col :span="10">
				<div class="grid-content bg-purple-light">
					<div class="bs-license"  v-if="isShowUploadDiv(statusList.formDisable,userdata.certificate)">
						<p>{{licenseUploadTest.bs}}</p>
						<licenseUpload ref="bsLicense" 
							:firstFile="changeUrl(userdata.certificate)" 
							:upLoadDisabled="statusList.formDisable"
						/>
					</div>

					<div class="sc-license" v-if="isShowUploadDiv(statusList.formDisable,userdata.safetyCertificate)">
						<p>{{licenseUploadTest.sc}}</p>
						<licenseUpload ref="scLicense" 
							:firstFile="changeUrl(userdata.safetyCertificate)" 
							:upLoadDisabled="statusList.formDisable"
						/>
					</div>
				</div>
			</el-col>
		</el-row>

		<div class="guidelines" v-if="!statusList.formDisable">
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
	import licenseUpload from "./components/licenseUpload"
	
	import {mapGetters,mapState} from "vuex"
	import {throttle,fileShowPath} from "@/utils"
	import { userInfoObj } from "@/utils/userInfo"
	
	export default {
		name: 'UserInfo',
		data() {
			return {
				guidelinesVisible: false, //打开 认证指引 开关
				agreeServe: false,
				statusList:{}//状态管理，不同状态控制要显示什么内容
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
			}),
			licenseUploadTest(){//执照显示文字
				let textObj={
					bs:'请上传营业执照文件',
					sc:'请上传安全员执照文件'
				}
				if(this.isCertification=="RenZhengZhong" || this.isCertification=="ZhengChang" ){
					for (let p in textObj){
						textObj[p]=textObj[p].substr(3,textObj[p].length);
					}
				}
				return textObj;
			}
		},
		methods: {
			//表单提交
			submitForm:throttle(function(){
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
								certificate: this.$refs['bsLicense'].fileUrl, //营业执照文件
								safetyCertificate: this.$refs['scLicense'].fileUrl, //安全员执照文件
							}
							
							//合并对象，如果键名相同，第二个参数覆盖第一个
							formData=Object.assign(formData,postData);
							
							//提交认证接口
							this.api.modifyRegistApi(formData).then((data) => {
								if (data.code == "Ok" ) {
									let token = sessionStorage.getItem('token');
									this.$store.dispatch('authorityNav', token);
									this.$message.success("我公司将在3个工作日内完成认证工作，请您耐心等待。");
									this.agreeServe=false;
									setTimeout(()=>{
										this.$router.go(0);
									},1000)
								} else {
									this.$message.error("认证失败");
									setTimeout(()=>{
										this.$router.go(0);
									},1000)
								}
							});
						} else {
							this.$message.warning("请勾选同意认证协议");
						}
					}
				});
			},2000),
			
			//状态管理，不同状态控制要显示什么内容
			statusManagement(){
				//配置 状态开关名称，用于HTML的 v-if 填写
				const StatusConfiguration=(remarkBox,formDisable)=>
				{
					return {
						remarkBox:remarkBox || false, //提示信息div显示
						formDisable:formDisable || false //表单是否禁用
					}
				}
				
				if(this.isCertification){
					switch (this.isCertification){
						//正常
						case "ZhengChang": 
						this.statusList=StatusConfiguration(false,true);
						return ;
						//未认证
						case "WeiRenZheng":
						if(this.userdata.remark){//如果有提示，显示信息框
							this.statusList=StatusConfiguration(true,false);
						}else{
							this.statusList=StatusConfiguration(false,false);
						}
						return ;
						//认证失败
						case "RenZhengShiBai":
						this.statusList=StatusConfiguration(false,false);
						return ;
						//认证中
						case "RenZhengZhong":
						this.statusList=StatusConfiguration(true,true);
						return ;
						//已禁用
						case "YiJinYong":
						this.statusList=StatusConfiguration(false,true);
						return ;
						
						default: 
						return StatusConfiguration();
					}
				}else throw new Error("isCertification状态出问题，请检查vux返回")
				
			},
			isShowUploadDiv(status,url){
				if(status && url) return true
			},
			//返回完整的文件链接
			changeUrl: url => fileShowPath(url, '',false)
		},
		mounted() {
			this.statusManagement();
		},
		components: {
			PageHeader,
			formUserInfo,
			licenseUpload
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
