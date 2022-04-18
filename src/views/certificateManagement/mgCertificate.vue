<template>
	<div class="mg-certificate">
		<!-- 主题内容顶部 -->
		<PageHeader :breadcrumbItem="$route.meta.headName">
			<el-button type="primary" @click="BatchDownload()">批量下载</el-button>
		</PageHeader>
		<div class="mg-certificate-box">
			<template>
				<el-table :data="tableData" @selection-change="handleSelectionChange"> border style="width: 100%"
					:header-cell-style="{textAlign:'center'}"
					:cell-style="{textAlign:'center'}">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="created" label="提交时间">
					</el-table-column>
					<el-table-column prop="subject.name" label="项目名称" width="120">
					</el-table-column>
					<el-table-column prop="" label="联系人手机号">
					</el-table-column>
					<el-table-column prop="subject.remark" label="备注">
					</el-table-column>
					<el-table-column prop="tableData" label="状态" width="80">
						<template slot-scope="scope">
							<div slot="reference" class="name-wrapper">
								<el-tag :type="scope.row.status" size="medium">
									{{ scope.row.status=="Completed"?"完成":"未完成" }}</el-tag>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="zip" label="	受理业务员" width="120">
					</el-table-column>
					<el-table-column label="操作" width="100">
						<template slot-scope="scope">
							<el-button type="primary" @click="downLoadLertificate(scope.row)" size="small">下载
							</el-button>

							<!-- 	<el-button type="primary" v-if="scope.row.opBtnList.orderEditBtn" size="small">委托单编辑</el-button>
							<el-button type="primary" v-if="scope.row.opBtnList.entrustFileBtn" size="small">委托文件</el-button>
							<el-button type="primary" v-if="scope.row.opBtnList.paymentShowBtn" size="small">支付证明</el-button>
							<el-button type="primary" v-if="scope.row.opBtnList.downCertBtn" size="small">下载证书</el-button> -->
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
	import {
		mgCertificateApi
	} from "@/request/api"
	import {
		fileLinkToStreamDownload
	} from "@/utils"
	import JSZip from "jszip";
	import JSZipUtils from "jszip-utils";
	import {
		saveAs
	} from 'file-saver';

	export default {
		name: 'mgCertificate', //证书管理
		data() {
			return {
				tableData: [],
				dataTotal: 0, //数据一共有多少条
				pageSize: 8, //每页显示多少条数据
				multipleSelection: []
			}
		},
		methods: {
			//获取证书列表数据
			certificateData(page) {
				mgCertificateApi({
					page: page,
					size: this.pageSize,
				}).then((data) => {
					console.log(data);
					if (data.code == "Ok") {
						let getData = data.data.content;
						console.log("getData", getData);
						this.tableData = JSON.parse(JSON.stringify(getData)); //初始化数据
						this.dataTotal = data.data.totalElements; //一共多少条数据

					} else {
						this.$confirm('加载数据失败，请重新刷或者联系客服', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
					}
				});
			},

			//已经选中行的事件
			handleSelectionChange(val) {
				this.multipleSelection = val;
				console.log(val)
			},
			//下载事件
			downLoadLertificate(val) {
				//单个PDF文件下载事件
				fileLinkToStreamDownload(val.reportFile, val.recordFile);
			},
			//批量下载事件
			BatchDownload() {
				let selectionUrl = JSON.parse(JSON.stringify(this.multipleSelection));
				let urlList = [];
				selectionUrl.forEach((p) => {
					urlList.push(p.reportFile);
				});

				// var zip = new JSZip();
				// zip.file("Hello.txt", urlList);
				// zip.generateAsync({type:"blob"}).then(function (blob) { // 1) generate the zip file
				//     const file = new Blob([blob], { type: 'application/pdf' });
				// 	saveAs(file, "hello.zip");                          // 2) trigger the download
				// })

				this.unZipHandle(urlList)
			},
			async unZipHandle(arr) {
				// arr为需要解压的数组
				let zip = new JSZip();
				let promises = []; // 存放解压的文件
				let that = this;
				// 这里用await就是为了改成同步，需要等数据处理完才进行下一步
				await arr.forEach((item) => {
					let promise = that
			 		.getUrlBuffer(item)
						.then((pdf) => {
							// getUrlBuffer这里是把url解压转化成文件
							for (let key in pdf.files) {
								// 判断是否是目录
								if (!pdf.files[key].dir) {
									if (/\.(pdf)$/.test(pdf.files[key].name)) {
										// 这里判断是pdf文件，其他文件的话，换个格式
										return pdf
											.file(pdf.files[key].name)
											.async("ArrayBuffer")
											.then((data) => {
												// 把文件转化为buffer
												//this.arrayBufferToBlob(data);//这个是因为pdf需要展示，所以我这边把buffer转化成blob文件会得到个url，方便用来展示。后面会补充这个方法
												// return出buffer生成的文件
												return zip.file(pdf.files[key].name, data, {
													binary: true,
												});
											});
									}
			  			}
							}
							// zip.file("测试", pdf, { binary: true });
						});
					// 将循环得到的所有promise存到一个数组里面
					promises.push(promise);
				});
				Promise.all(promises) // this.policyNo
					.then((res) => {
						// 这里就简单了，当所有promise执行完之后，打包下载
						zip
							.generateAsync({
								type: "blob",
							})
							.then((content) => {
								// zipName这个是压缩包名称，可以自己定义
								FileSaver.saveAs(content, zipName);
							});
					});
			},
			getUrlBuffer(url) {
				// zip解压成源文件的方法
				return new JSZip.external.Promise(function(resolve, reject) {
					JSZipUtils.getBinaryContent(url, function(err, data) {
						if (err) {
							reject(err);
						} else {
							resolve(data);
						}
					});
				}).then(function(data) {
					return JSZip.loadAsync(data);
				});
			},
			arrayBufferToBlob(arrayBuffer) { // 为了得到文件临时的url
				return URL.createObjectURL(
					new Blob([arrayBuffer], {
						type: "application/pdf"
					}) // 不加type会乱码
				);
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
				this.certificateData(page);
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
</style>
