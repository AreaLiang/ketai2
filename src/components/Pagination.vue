<template>
	<div class="pagination">
		<!--
			每页显示条目个数 :page-size="10" ,默认10
			点击页码触发事件 @current-change="xxx"
		 -->
		<el-pagination background layout="prev, pager, next" 
			:total="dataTotal" 
			:page-size="pageSize"
			@current-change="handleCurrentChange" :current-page="currentPage">
		</el-pagination>
	</div>
</template>

<script>
	export default {
		name: 'Pagination', //分页功能
		data() {
			return {

			}
		},
		methods: {
			//点击页码触发事件
			handleCurrentChange(page) {
				this.$emit('pageChange',page)
			}
			
		},
		props: {
			dataTotal: Number,
			pageSize: {
				type: Number,
				default: 10
			},
			currentPage: {
				type: Number,
				default: 1
			}
		}
	}
</script>

<style scoped lang="less">

</style>
