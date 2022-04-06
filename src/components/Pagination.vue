<template>
	<div class="pagination">
		<!--
			每页显示条目个数 :page-size="10" ,默认10
			点击页码触发事件 @current-change="xxx"
		 -->
		<el-pagination background layout="prev, pager, next" :total="dataTotal" :page-size="pageSize ? pageSize:10" @current-change="pageChange">
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
		methods:{
			//点击页码触发事件
			pageChange(page){
				this.$bus.$emit('pageNumber',page)
			}
		},
		components: {

		},
		props:{
			dataTotal:Number,
			pageSize:Number
		}
	}
</script>

<style scoped lang="less">

</style>
