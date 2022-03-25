<template>
	<div class="pdf-box">
		<!-- <a href="https://www.gjtool.cn/pdfh5/git.pdf">打开</a> -->
		<!-- <pdf  ref="pdf" v-for="i in numPages" :key="i" :src="url" :page="i">
		</pdf> -->
		<iframe class="pdf-show" src="https://www.gjtool.cn/pdfh5/git.pdf" width="500" height="500"></iframe>
	</div>
</template>

<script>
	// import pdf from 'vue-pdf'
	export default {
		name: '',
		data() {
			return {
				url: 'https://www.gjtool.cn/pdfh5/git.pdf',
				numPages: null, // pdf 总页数
			}
		},
		mounted() {
			// this.getNumPages();
			
		},
		components: {
			// pdf
		},
		methods: {
			// getNumPages() {
			// 	let loadingTask = pdf.createLoadingTask(this.url)
			// 	loadingTask.promise.then(pdf => {
			// 		this.numPages = pdf.numPages
			// 	}).catch(err => {
			// 		console.error('pdf 加载失败', err);
			// 	})
			// },
		},
		
	}
</script>

<style scoped lang="less">
	.pdf-box {
		height: 98%;
		width: 100%;
	}
	.pdf-show{
		height: 100%;
		width: 100%;
	}
	
</style>
