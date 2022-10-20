<template>
	<div class="pg-head">
		<div class="breadcrumb">
			<span class="breadcrumb__item" v-for="(p,index) in breadcrumbItem" :key="index">
				{{p}}
			</span>

			<div style="text-align: right;">
				<!-- 新建委托按钮 的插槽 -->
				<slot></slot>
			</div>

		</div>
		<div class="line"></div>

	</div>
</template>

<script>
	export default {
		name: 'PageHeader',
		data() {
			return {

			}
		},
		mounted() {

		},
		components: {

		},
		props: ['breadcrumbItem']
	}
</script>

<style scoped lang="less">
	.pg-head {
		.breadcrumb {
			padding: 10px 0 20px 0;
			overflow: hidden;
			position: relative;
			line-height: 24px;
		}

		.breadcrumb__item {
			padding: 0 3px;
			float: left;
			vertical-align: middle;
			position: relative;

			&:nth-child(1) {
				color: #0e90d2;
				font-size: 18px;
				font-weight: bold;
			}

			&:nth-child(3) {
				font-size: 10px;
				color: #666;
			}
		}

		.line {
			background-color: #989898;
			width: 100%;
			height: 10px;
		}
	}
</style>
