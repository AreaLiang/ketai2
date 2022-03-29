<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
	export default {
		name: 'app',
		components: {

		}
	}
</script>

<style>
	body,
	html,
	#app {
		height: 100%;
		width: 100%;
		padding: 0;
		margin: 0;
	}
	
	/*在Chrome下移除input[number]的上下箭头*/
	.no-number::-webkit-outer-spin-button,
	.no-number::-webkit-inner-spin-button {
	  margin: 0;
	  -webkit-appearance: none !important;
	}
	 
	.no-number input[type="number"]::-webkit-outer-spin-button,
	.no-number input[type="number"]::-webkit-inner-spin-button {
	  margin: 0;
	  -webkit-appearance: none !important;
	}
	 
	/*在firefox下移除input[number]的上下箭头*/
	.no-number {
	  -moz-appearance: textfield;
	}
	 
	.no-number input[type="number"] {
	  -moz-appearance: textfield;
	}
</style>
