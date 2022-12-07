<template>
	<div class="bsEntrustmentDiglog">
		<el-dialog title="业务委托单" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
			:modal-append-to-body="false" custom-class="entrust-diglog">
			<div v-loading="loading">
				<el-row :gutter="30">
					<el-col :md="12" :lg="11">
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
										<el-input type="textarea" v-model="addEntrustForm.remark" :rows="5"></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							
							<!-- 委托单信息 -->
							<el-row>
								<div class="marginTop">
									<el-table :data="tableData" height="250" border="" style="width: 100%"
									:header-cell-style="{textAlign:'center'}" 
									:cell-style="{textAlign:'center'}">
										<el-table-column type="index" width="50" label="序号">
										</el-table-column>
										<el-table-column label="器具名称" >
											<template slot-scope="scope">
												<el-input v-model="scope.row.value" placeholder="请输入器具名称" :maxlength="18"></el-input>
											</template>
										</el-table-column>
										<el-table-column label="数量" width="160">
											<template slot-scope="scope">
												<el-input-number size="mini" v-model="scope.row.number" :min="1" :max="10000"></el-input-number>
											</template>
										</el-table-column>
										<el-table-column label="操作" width="80">
											<template slot-scope="scope">
												<el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
											</template>
										</el-table-column>
									</el-table>	
								</div>
							</el-row>
							
							<!-- 操作按钮组 -->
							<el-row>
								<div class="marginTop">
									<el-col :span="24">
										<el-button type="primary" @click="downLoadPdf">下载</el-button>
										<el-button type="primary" @click="cleanTableInfo">清空</el-button>
										<el-button type="primary" @click="previewPdf">预览</el-button>
										<el-button type="primary" @click="addInfoRow">+</el-button>
									</el-col>
								</div>
							</el-row>
						</el-form>
					</el-col>

					<el-col :md="12" :lg="13">
						<div class="pdfShow">
							<iframe class="pdf-show" :src="wordUrl" width="100%" height="660"></iframe>
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
	import {mapState} from 'vuex'
	import {fileShowPath,formValidation,fileLinkToStreamDownload} from '@/utils'
	import {EntrustObj} from '../js/bsEntrust'

	export default {
		name: 'bsEntrustmentDiglog', //新建业务委托 弹出框
		data() {
			return {
				dialogFormVisible: false,
				tableData: [],//用于 委托单信息 表格渲染
				defaultTableFromat:{//设置默认参数，委托单信息 表格渲染对象格式
					value: '',
					subject:'',
					number: 1,
					price:"0.00"
				},
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
				wordFile: '',//传给后台的文件路径
				loading: false,
				wordUrl: '',//iframe显示文档的路径
				rowData: {} ,//点击修改业务委托传入的当行数据
			}
		},
		watch: {
			dialogFormVisible: function() { //监听dialog的变化
				if (this.dialogFormVisible) {//dialog打开时候
					this.$nextTick(() => {
						this.$refs['addEntrustForm'].clearValidate(); //移除表单验证结果
						this.wordUrl = '';//iframe 设置空显示
					});
				
					let userData = _.cloneDeep(this.userdata);
					this.addEntrustForm = Object.assign(this.addEntrustForm, userData, this.rowData);//整合默认数据
					
					//如果是 修改业务委托 
					if (this.isCreatedOrder) { 
						let jsonData = _.cloneDeep(this.rowData);
						if (jsonData.orderFilePdf) { //如果证件的路径不为空
							this.$nextTick(() => { //如果已经上传了委托文件，则赋值路径显示文件内容
								let orderFilePdf = jsonData.orderFilePdf;//获取 委托单文件路径
								this.wordUrl = fileShowPath(orderFilePdf, 'pdf'); //转换为可以iframe 显示的pdf文件路径
								this.tableData=JSON.parse(jsonData.itemJson);//器具信息赋值
							})
						}
					}
					//如果是 新建委托单
					else{
						//清空备注
						this.addEntrustForm.remark='';
						//给表格添加默认的第一行，defaultTableFromat 为默认格式
						this.tableData.push(_.cloneDeep(this.defaultTableFromat))
					}
				}
				//dialog 关闭时候
				else{
					//如果是 修改业务委托 
					if (this.isCreatedOrder) { }
					//如果是 新建委托单
					else{
						this.tableData=[];//清空表格中的数据
						this.wordUrl=[];//清空PDF 下载链接
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
						let isPass=this.tableData.every((p)=> p.value != "")//检查每一项 器具名称 是否已填写
						if(isPass) {//如果都填写，提交接口 生成pdf链接并赋值
							this.loading = true;
							let postData = this.commonParameters();
							
							if (this.isCreatedOrder) {//如果是修改委托单,重新赋值id
								postData.customerId=this.rowData.creator.businessManager.id;
								postData.orderId=this.rowData.id;
							}
							
							//执行提交业务委托的 事件接口
							this.$emit('subEntrust', {
								obj: this,
								postData: postData
							});
						}else this.$message.warning("请填写器具名称");
						
					} else false
				});
			},
			
			//点击下载 按钮事件，下载预览后的pdf文件
			downLoadPdf(){
				if(this.wordUrl){
					fileLinkToStreamDownload(this.wordUrl,this.wordUrl);
				}else this.$message.warning("先预览生成pdf");
			},
			
			//点击 清空 按钮事件，清空表格内容
			cleanTableInfo(){
				let defaultFromat =_.cloneDeep(this.defaultTableFromat);//深克隆，解除内存地址相同
				this.tableData=[];//清空数组
				this.tableData.push(defaultFromat);//添加默认第一行
			},
			
			//点击 预览 按钮事件，预览填完信息后，返回的pdf文件
			previewPdf(){
				let isPass=this.tableData.every((p)=> p.value != "")//检查每一项 器具名称 是否已填写
			
				if(isPass) {//如果都填写，提交接口 生成pdf链接并赋值
					let params=this.commonParameters();
					if (this.isCreatedOrder) params.customerId=this.addEntrustForm.creator.id;
					
					this.api.previewApi(params).then( res =>{
						if(res.code=="Ok") this.wordUrl=fileShowPath(res.data,"",false);//赋值iframe的路径
						else this.$message.error(res.msg);
					})
				}else this.$message.warning("请填写器具名称");
				
			},
			
			//点击加 + 号按钮，添加 新的表格行
			addInfoRow(){
				if(this.tableData.length<14){//最多添加14条
					this.tableData.push({...this.defaultTableFromat});//像表格插入行数据
				}
			},
			
			//点击 行删除按钮事件，删除对应行
			handleDelete(rowIndex){
				if (this.tableData.length > 1) this.tableData.splice(rowIndex, 1)
			},
			
			//共同参数
			commonParameters(){
				let params=new EntrustObj(this.addEntrustForm); //获取委托单位基本信息
				params.itemJson=_.cloneDeep(this.tableData);
				params.itemJson=params.itemJson.map((p,index) =>{//添加 特定的code值
					p.code="E"+(index+1).toString(); //添加code 值，已E为开头
					p.number=p.number.toString();
					return p;
				});
				return params;
			}
		},
		mounted() {
			this.$bus.$on('currentRowData',data => this.rowData=data || {});//绑定行数据
		}
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
			width: 80%;
			margin-top:1vh !important;
			.el-upload-list--text {
				overflow: hidden;
				height: 30px;
			}
		}

		.pdfShow {
			background: #ccc;
			height: 662px;
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
		.el-dialog__body{
			padding:20px
		}
		.marginTop{
			margin-top: 15px;
		}
	}
</style>
