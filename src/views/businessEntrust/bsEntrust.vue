<template>
	<div class="businessEntrust" v-loading="loading">
		<!-- 主题内容顶部 -->
		<PageHeader :breadcrumbItem="$route.meta.headName">
			<el-button type="primary" @click="addEntrust()">新建业务委托</el-button>
		</PageHeader>
		<div class="entrust-manage">
			<template>
				<el-table :data="tableData" border style="width: 100%" :header-cell-style="{textAlign:'center'}"
					:cell-style="{textAlign:'center'}">
					<el-table-column prop="created" label="提交时间" width="180">
					</el-table-column>
					<el-table-column prop="contact" label="联系人" width="120">
					</el-table-column>
					<el-table-column prop="mobile" label="联系人手机号">
					</el-table-column>
					<el-table-column prop="remark" label="备注" >
					</el-table-column>
					<el-table-column prop="statusCn" label="状态" width="100">
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<el-tooltip class="item" effect="dark" :content="scope.row.reason" :disabled="statusMeg(scope.row)" placement="top-start">
									<el-tag :type="scope.row | tagType('color')" :effect="scope.row | tagType('effect')" size="medium">
										{{ scope.row.statusCn }}
									</el-tag>
								</el-tooltip>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="receiver.name" label="受理业务员" width="120">
					</el-table-column>
					<el-table-column prop="id" title="id" label="单号" width="200">
					</el-table-column>
					<el-table-column label="操作" width="350">
						<template slot-scope="scope">
							<el-button type="primary" size="small"
								@click="openDialog('editEntrustDiglog',scope.row)"
								v-if="bsBtnShow(scope.row.status,'DaiFenPei,DaiShouLi,ShouLiShiBai')">
								<i class="el-icon-edit-outline" ></i>
								委托单编辑
							</el-button>
							
							<el-button type="primary" size="small"
								@click="openDialog('entrustFileDialog',scope.row)"
								v-if="bsBtnShow(scope.row.status,'DaiShenHe,DaiFuKuan,DaiWanGong,DaiHeDui,DaiShiGong,YiWanCheng,YuFaZheng')">
								委托文件
							</el-button>

							<el-button type="primary" size="small"
								@click="openDialog('acceptanceDialog',scope.row)"
								v-if="bsBtnShow(scope.row.status,'DaiWanGong')"
								>
								{{scope.row.checkFile ? "完工验收单" : "上传验收单"}}
							</el-button>
							
							<!-- 支付证明和上传支付证明 -->
							<el-button type="primary" size="small"
								@click="openDialog('paymentProveDialog',scope.row)" 
								v-if="bsBtnShow(scope.row.status,'DaiHeDui,YiWanCheng,DaiFuKuan,YuFaZheng')"
								>
								{{scope.row | isPassPayment}}
							</el-button>
							
							<el-button type="primary" size="small"
								@click="DownloadCertificate(scope.row)"
								v-if="bsBtnShow(scope.row.status,'YiWanCheng,YuFaZheng')"
								>
								下载证书
							</el-button>

							<el-button type="primary"  size="small"
							@click="submitAgain(scope.row)" 
							v-if="bsBtnShow(scope.row.status,'ShouLiShiBai')"
							>
							重新提交
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<div class="pagination-box">
				<!-- 分页功能 -->
				<Pagination :dataTotal="dataTotal" :pageSize="pageSize" :currentPage="currentPage"/>
			</div>
		</div>

		<!-- 新建业务委托 弹出框 -->
		<addEntrustDiglog ref="addEntrustDiglog"  @subEntrust='subAddEntrust' />
		
		<!-- 委托单编辑 弹出框 -->
		<editEntrustDiglog ref="editEntrustDiglog" @subEntrust='subModifyEntrust' :isCreatedOrder="true" />

		<!-- 委托文件查看 弹出框 -->
		<entrustFileDialog ref="entrustFileDialog"/>

		<!-- 上传验收单/完工验收单 弹出框 -->
		<acceptanceDialog ref="acceptanceDialog" :currentPage="currentPage" />

		<!-- 支付证明/上传支付证明 弹出框 -->
		<paymentProveDialog ref="paymentProveDialog" :currentPage="currentPage" />

	</div>
</template>

<script>
	import PageHeader from "@/components/PageHeader"
	import Pagination from "@/components/Pagination"
	import addEntrustDiglog from "./components/bsEntrustmentDiglog"
	import editEntrustDiglog from "./components/bsEntrustmentDiglog"
	import entrustFileDialog from "./components/entrustFileDialog"
	import acceptanceDialog from "./components/acceptanceDialog"
	import paymentProveDialog from "./components/paymentProveDialog"
	import {bsEntrustmentApi,modifyEntrustOrderApi,addEntrustOrderApi} from "@/request/api"
	import {timestamp,throttle} from '@/utils'
	import {cgBsEntrustData,statusStyleControl,EntrustObj} from '@/utils/bsEntrust'
	import NProgress from 'nprogress' // 引入头部进度条

	export default {
		name: 'bsEntrust', //业务委托
		data() {
			return {
				tableData: [],
				dataTotal: 0, //数据一共有多少条
				pageSize: 8, //每页显示多少条数据
				loading: true,
				currentPage:1,
			}
		},
		computed: {
			statusMeg(){//状态框，鼠标指中时候 提示信息退回
				return (currentRow)=> {
					if(currentRow.status=="DaiFuKuan" && currentRow.reason || currentRow.status== "ShouLiShiBai") return false
					else return true
				}
			},
			
		},
		components: {
			PageHeader,
			Pagination,
			addEntrustDiglog,
			entrustFileDialog,
			acceptanceDialog,
			paymentProveDialog,
			editEntrustDiglog
		},
		filters:{
			isPassPayment(val){//如果没有上传过或者 退回的支付证明需要重新上传
				if(val.payFile){
					if(val.reason && val.status =='DaiFuKuan') return '上传支付证明' 
					else return '支付证明'
				}else{
					return '上传支付证明'
				}
			},
			
			//支付证明被退回时候，按钮显示的颜色
			failPaymentColor(val){
				if(val.reason && val.status== "DaiFuKuan"){
					return 'danger'
				}else return val.statusBtnColor
			},
			
			//标签样式选择方法，color => 颜色，effect => tags是风格
			tagType(row,type){
				const getStatusList =statusStyleControl().get(row.status);
				if(type == 'color') {
					if(row.reason && row.status== "DaiFuKuan") return 'danger'
					else return getStatusList?.color;
				}else if(type == "effect") return getStatusList?.effect;
			}
		},
		methods: {
			/* 打开弹出层 
			 *** 第一个参数为该弹出层组件的ref 名字，字符串传入,
			 *** 第二个是表格每行的参数 默认scope.row 
			 * */
			openDialog(dialogName, row) {
				this.$refs[dialogName].dialogFormVisible = true;
				this.$bus.$emit('currentRowData', row); //赋值所点击的行 数据
			},
			//新建业务委托
			addEntrust() {
				let dialog = this.$refs.addEntrustDiglog;
				dialog.dialogFormVisible = true;
			},
			//提交 新建业务委托
			subAddEntrust:throttle(function(res){//节流函数
				let {obj,postData}=res;
				addEntrustOrderApi(postData).then((data) => {
					this.afterSubmit('addEntrustDiglog',data, "新建成功", "新建失败");//提交后提示信息
				}).finally(()=>{obj.loading=false});
			},3000),
			
			//提交 委托单编辑
			subModifyEntrust:throttle(function(res){//节流函数
				let {obj,postData}=res;
				
				modifyEntrustOrderApi(postData).then((data) => {
					this.afterSubmit('editEntrustDiglog',data, "修改成功", "修改失败");//提交后提示信息
				}).finally(()=>{obj.loading=false});
			}),
			//重新提交委托单
			submitAgain(currentRow){
				let data=_.cloneDeep(currentRow);
				let postData=new EntrustObj(data);//委托单需要的信息
				postData.customerId=data.creator.businessManager.id;
				postData.orderId=data.id;
				postData.itemJson=JSON.parse(data.itemJson);
			
				modifyEntrustOrderApi(postData).then((data) => {
					if (data.code == "Ok" ) {
						this.$message.success("提交成功");
						this.$bus.$emit('pageNumber', this.currentPage); //刷新当前页
					} else {
						this.$message.error("提交失败");
					}
				});
			},
			//页码点击事件,page 是页码， pageSize 是每页显示多少条数据
			PaginationClick(page, pageSize) {
				this.loading=true;
				NProgress.start() //开启进度条
				bsEntrustmentApi({
					page: page,
					size: pageSize
				}).then((res) => {
					let data = res.data;
					if (res.code == "Ok" ) {
						this.dataTotal = data.totalElements; //所有数据的 数量
					}
					this.tableData = cgBsEntrustData(data); //赋值数据渲染
					NProgress.done(); //结束进度条
					this.loading=false;
				}).catch(()=> this.loading=false);
			},
			//点击下载证书事件
			DownloadCertificate(row) {
				this.$router.push({path:'/Home/mgCertificate',query:{"id":row.id}});
			},
			/*  向后台提交数据后，页面更新和提示操作，
			 *** objName 组件的ref名称 ,data:后台返回的数据，success:成功后提示信息,error：失败后提示信息 
			 * */
			afterSubmit( objName, data, success, error) {
				let obj = this.$refs[objName];
				if (data.code == "Ok" ) {
					this.$message.success(success);
					obj.dialogFormVisible = false;
					this.$bus.$emit('pageNumber', this.currentPage);
				} else {
					this.$message.error(error);
				}
			},
			
			/**
			 * 业务委托的操作按钮显示控制
			 * @param {String} authorization [必填，输入哪些状态条件下可以显示，多个参数用逗号隔开 如：‘author,editer’ ]
			 * @param {String} status [必填，当前行的状态值，用于与权限数组做对比]
			 */
			bsBtnShow(status,authorization){
				const arr=authorization.split(",");//把字符串用 , 来分割为数组
				return arr.some( p => p == status);//如果该权限是在允许权限范围内，则返回true
			}
		},
		mounted() {
			this.PaginationClick(0, this.pageSize); //进来默认渲染第一页，后端数据第一页的页码为 0
			//绑定事件，页码发生改变时候重新发送请求显示数据
			this.$bus.$on('pageNumber', (page = 1) => {
				this.currentPage=page;//保存当前页码，用于某些交换后刷新当页
				this.PaginationClick(page - 1, this.pageSize);
			})
			
		},
		beforeDestroy() {
			this.$bus.$off('currentRowData');// 解绑
			this.$bus.$off('pageNumber');// 解绑分页
		}
	}
</script>

<style scoped lang="less">
	.pagination-box {
		margin: 20px 0;
		text-align: right;
	}

	.entrust-manage {
		margin-top: 20px;
	}
</style>
