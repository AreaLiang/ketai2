<template>
	<div class="businessEntrust">
		<!-- 主题内容顶部 -->
		<PageHeader :breadcrumbItem="$route.meta.headName">
			<el-button type="primary" @click="addEntrust">新建业务委托</el-button>
		</PageHeader>
		<div class="entrust-manage">
			<template>
				<el-table :data="tableData" border style="width: 100%" :header-cell-style="{textAlign:'center'}"
					:cell-style="{textAlign:'center'}">
					<el-table-column prop="date" label="提交时间">
					</el-table-column>
					<el-table-column prop="name" label="联系人" width="120">
					</el-table-column>
					<el-table-column prop="province" label="联系人手机号">
					</el-table-column>
					<el-table-column prop="city" label="备注">
					</el-table-column>
					<el-table-column prop="status" label="状态" width="80">
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<el-tag :type="scope.row.statusBtnStyle" size="medium">{{ scope.row.status }}</el-tag>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="zip" label="	受理业务员" width="120">
					</el-table-column>
					<el-table-column label="操作" width="300">
						<template slot-scope="scope">
							<!-- <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
							 -->
							<el-button type="primary" v-if="scope.row.opBtnList.orderEditBtn" size="small">委托单编辑</el-button>
							<el-button type="primary" v-if="scope.row.opBtnList.entrustFileBtn" size="small">委托文件</el-button>
							<el-button type="primary" v-if="scope.row.opBtnList.paymentShowBtn" size="small">支付证明</el-button>
							<el-button type="primary" v-if="scope.row.opBtnList.downCertBtn" size="small">下载证书</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<div class="pagination-box">
				<!-- 分页功能 -->
				<Pagination :dataTotal="dataTotal" :pageSize="2"/>
			</div>
		</div>
			
		<!-- 新建业务委托 弹出框 -->
		<addEntrustDiglog ref="addEntrustDiglog"></addEntrustDiglog>
	</div>
</template>

<script>
	import PageHeader from "@/components/PageHeader"
	import Pagination from "@/components/Pagination"
	import addEntrustDiglog from "@/views/businessEntrust/addEntrustDiglog"
	
	export default {
		name: 'bsEntrust', //业务委托
		data() {
			return {
				tableData: [{
					date: '2016-05-02',
					name: '王小虎',
					province: '上海',
					city: '普陀区',
					status: '可取证',
					zip: 200333,
					statusBtnStyle: "success",
					opBtnList: {
						orderEditBtn:false,//委托单编辑 按钮
						entrustFileBtn:true,//委托文件 按钮
						paymentShowBtn:false,//支付证明 按钮
						downCertBtn:true,//下载证书 按钮
					}
				}, {
					date: '2016-05-04',
					name: '王小虎',
					province: '上海',
					city: '普陀区',
					status: '待受理',
					zip: 200333,
					statusBtnStyle: "info",
					opBtnList: {
						orderEditBtn:false,//委托单编辑 按钮
						entrustFileBtn:true,//委托文件 按钮
						paymentShowBtn:false,//支付证明 按钮
						downCertBtn:false,//下载证书 按钮
					}
				}, {
					date: '2016-05-01',
					name: '王小虎',
					province: '上海',
					city: '普陀区',
					status: '可取证',
					zip: 200333,
					statusBtnStyle: "success",
					opBtnList: {
						orderEditBtn:true,//委托单编辑 按钮
						entrustFileBtn:false,//委托文件 按钮
						paymentShowBtn:false,//支付证明 按钮
						downCertBtn:false,//下载证书 按钮
					}
				}, {
					date: '2016-05-03',
					name: '王小虎',
					province: '上海',
					city: '普陀区',
					status: '检测中',
					zip: 200333,
					statusBtnStyle: "warning",
					opBtnList: {
						orderEditBtn:false,//委托单编辑 按钮
						entrustFileBtn:true,//委托文件 按钮
						paymentShowBtn:true,//支付证明 按钮
						downCertBtn:true,//下载证书 按钮
					}
				}, {
					date: '2016-05-03',
					name: '王小虎',
					province: '上海',
					city: '普陀区',
					status: '检测中',
					zip: 200333,
					statusBtnStyle: "warning",
					opBtnList: {
						orderEditBtn:false,//委托单编辑 按钮
						entrustFileBtn:true,//委托文件 按钮
						paymentShowBtn:true,//支付证明 按钮
						downCertBtn:true,//下载证书 按钮
					}
				}, {
					date: '2016-05-03',
					name: '王小虎',
					province: '上海',
					city: '普陀区',
					status: '检测中',
					zip: 200333,
					statusBtnStyle: "warning",
					opBtnList: {
						orderEditBtn:false,//委托单编辑 按钮
						entrustFileBtn:true,//委托文件 按钮
						paymentShowBtn:true,//支付证明 按钮
						downCertBtn:true,//下载证书 按钮
					}
				}, {
					date: '2016-05-03',
					name: '王小虎',
					province: '上海',
					city: '普陀区',
					status: '检测中',
					zip: 200333,
					statusBtnStyle: "warning",
					opBtnList: {
						orderEditBtn:false,//委托单编辑 按钮
						entrustFileBtn:true,//委托文件 按钮
						paymentShowBtn:true,//支付证明 按钮
						downCertBtn:true,//下载证书 按钮
					}
				}],
				dataTotal:0,//数据一共有多少条
				
			}
		},
		components: {
			PageHeader,
			Pagination,
			addEntrustDiglog
		},
		methods: {
			handleClick(row) {
				console.log(row);
			},
			addEntrust(){
				this.$refs.addEntrustDiglog.dialogFormVisible = true
			}
			// cellStyle(row, column, rowIndex, columnIndex) {
			// 	console.log("66")
			// }
		},
		mounted() {
			this.dataTotal=this.tableData.length;
		}
	}
</script>

<style scoped lang="less">
.pagination-box{
	margin:20px 0;
	text-align: right;
}
.entrust-manage{
	margin-top:20px;
}
</style>
