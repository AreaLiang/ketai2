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
					<el-table-column prop="created" label="提交时间" width="180">
					</el-table-column>
					<el-table-column prop="contact" label="联系人" width="120">
					</el-table-column>
					<el-table-column prop="mobile" label="联系人手机号">
					</el-table-column>
					<el-table-column prop="remark" label="备注">
					</el-table-column>
					<el-table-column prop="statusCn" label="状态" width="80">
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<el-tag :type="scope.row.statusBtnStyle" size="medium">{{ scope.row.statusCn }}</el-tag>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="receiver" label="受理业务员" width="120">
					</el-table-column>
					<el-table-column label="操作" width="300">
						<template slot-scope="scope">
							<!-- <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
							 -->
							<el-button type="primary" v-if="scope.row.opBtnList.orderEditBtn" size="small">委托单编辑
							</el-button>
							<el-button type="primary" v-if="scope.row.opBtnList.entrustFileBtn" size="small">委托文件
							</el-button>
							<el-button type="primary" v-if="scope.row.opBtnList.paymentShowBtn" size="small">支付证明
							</el-button>
							<el-button type="primary" v-if="scope.row.opBtnList.downCertBtn" size="small">下载证书
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<div class="pagination-box">
				<!-- 分页功能 -->
				<Pagination :dataTotal="dataTotal" :pageSize="pageSize" />
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
	import {
		bsEntrustmentApi
	} from "@/request/api"
	import {timestamp} from '@/utils'
	import {cgBsEntrustData} from '@/utils/bsEntrust'

	export default {
		name: 'bsEntrust', //业务委托
		data() {
			return {
				tableData: [],
				dataTotal: 0, //数据一共有多少条
				pageSize:10,//每页显示多少条数据
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
			addEntrust() {
				this.$refs.addEntrustDiglog.dialogFormVisible = true
			},
			//页码点击事件,page 是页码， pageSize 是每页显示多少条数据
			PaginationClick(page,pageSize){
				bsEntrustmentApi({
					page:page,
					pageSize:pageSize
				}).then((res) => {
					let data=res.data;
					if(res.code=="20000"){
						this.dataTotal=data.totalElements;
					}
					
					this.tableData=cgBsEntrustData(data);
					// JSON.parse(JSON.stringify(cgBsEntrustData(data)))
					// console.log("业务委托：",data)
				});
			}
			// cellStyle(row, column, rowIndex, columnIndex) {
			// 	console.log("66")
			// }
		},
		mounted() {
			this.PaginationClick(0,this.pageSize);//进来默认渲染第一页，后端数据第一页的页码为 0
			//绑定事件，页码发生改变时候重新发送请求显示数据
			this.$bus.$on('pageNumber',(page)=>{
				this.PaginationClick(page-1,this.pageSize);
			})
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
