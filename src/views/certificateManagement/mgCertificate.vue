<template>
	<div class="mg-certificate">
		<!-- 主题内容顶部 -->
		<PageHeader :breadcrumbItem="$route.meta.headName">
			<el-button type="primary" @click="BatchDownload()">批量下载</el-button>
		</PageHeader>
		<div class="mg-certificate-box" v-loading="loading">
			<template>

				<el-table ref="certificateTable" :data="filterData" @selection-change="handleSelectionChange" border style="width: 100%"
					:header-cell-style="{textAlign:'center'}"
					:cell-style="{textAlign:'center'}"
					>
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="approveDate" label="提交时间">
						<template slot-scope="scope">
							<span>{{ scope.row.approveDate | changeTimestamp}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="orderNo" label="委托单号">
					</el-table-column>
					<el-table-column prop="reportNo" label="记录编号">
					</el-table-column>
					<el-table-column prop="applianceName" label="项目名称" >
					</el-table-column>
					<el-table-column prop="checkTypeValueName" label="鉴定类型" >
						<template slot-scope="scope">
							<span>{{ scope.row.checkType | checkTypeList}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="120">
						<template slot-scope="scope">
							<el-button type="primary" @click="downLoadLertificate(scope.row)" size="small">下载</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<div class="pagination-box">
				<!-- 分页功能 -->
				<Pagination :dataTotal="dataTotal" :pageSize="pageSize" />
			</div>
		</div>
	</div>
</template>

<script>
	import PageHeader from "@/components/PageHeader"
	import Pagination from "@/components/Pagination"
	import {mgCertificateApi} from "@/request/api"
	import {fileLinkToStreamDownload,BatchPdfDownload,timestampToTime} from "@/utils"
	import TypeList from '@/utils/typeList'

	export default {
		name: 'mgCertificate', //证书管理
		data() {
			return {
				tableData: [],//原数据
				filterData:[],
				dataTotal: 0, //数据一共有多少条
				pageSize: 8, //每页显示多少条数据
				multipleSelection: [],
				loading: true,
			}
		},
		filters:{
			checkTypeList(val){//鉴定类型
				let typeCh="";//中文含义
				if(TypeList.checkTypeList){
					TypeList.checkTypeList.some((p)=>{//匹配该数组 相同的id，符合则停止匹配，并赋值 中文含义返回
						if(p.id==val){
							typeCh=p.name;
							return true
						}else false
					});
				}
				return typeCh;
			},
			//时间戳变日期
			changeTimestamp(timestamp){
				return timestampToTime(timestamp)
			}
		},
		watch:{
			$route(to, from){//用于 业务委托转跳后，再点击证书管理时候会刷新显示全部证书列表
				this.certificateData(0);
			}
		},
		methods: {
			//获取证书列表数据
			certificateData(page) {
				this.loading= true;
				mgCertificateApi().then((data) => {
					if (data.code == "Ok") {
						let getData = data.data.content;
						
						this.tableData = JSON.parse(JSON.stringify(getData)); //初始化数据
						this.dataTotal = data.data.totalElements; //一共多少条数据
						//该接口没有做分页功能，所以前端计算数目做分页功能
						let [start,end] = [ page*this.pageSize , this.pageSize ];
						
						if(this.$route.query.id){//业务委托 点解下载证书跳转过去的证书管理
							this.$nextTick(()=>{
								let arr=[];
								this.tableData.map((p,index)=>{
									if(p.orderNo==this.$route.query.id) {
										arr.push(p);
									};
								})
								this.dataTotal=arr.length;
								this.filterData=arr.splice(start,end);
							})
						}else{//正常证书管理选项点击
							let orginArr=_.cloneDeep(this.tableData);//克隆原数组，即 所有证书列表
							this.filterData =orginArr.splice(start,end);
						}
					}
				
					this.loading=false;
				}).catch(()=> this.loading=false);
			},
			//已经选中行的事件
			handleSelectionChange(val) {
				this.multipleSelection = val;
				
			},
			//批量下载事件
			BatchDownload(arr) {
				let selectionUrl = _.cloneDeep(this.multipleSelection);

				let urlList = [];//多个pdf文件链接的数组
				selectionUrl.forEach((p) => {
					urlList.push(p.reportUrl);
				});
				if(urlList.length>0){//如果没有勾选多个文件
					//文件压缩打包
					BatchPdfDownload(urlList);
				}else{
					this.$message.warning("还没勾选要下载的证书文件");
				}
			},
			//下载事件
			downLoadLertificate(val) {
				let link=val.reportUrl;//需要下载的文件链接
				//单个PDF文件下载事件
				fileLinkToStreamDownload(link, val.reportNo);
			},

		},
		components: {
			PageHeader,
			Pagination
		},
		mounted() {
			//初始化数据
			this.certificateData(0);
			//绑定分页点击事件
			this.$bus.$on('pageNumber', (page) => {
				this.certificateData(page-1);
				
			})
		},
		beforeDestroy() {
			this.$bus.$off('pageNumber'); // 解绑分页
		}
	}
</script>

<style scoped lang="less">
	.pagination-box {
		margin: 20px 0;
		text-align: right;
	}
	// .mg-certificate-box{
	// 	height: 600px;
	// 	overflow: auto;
	// }
	
</style>
