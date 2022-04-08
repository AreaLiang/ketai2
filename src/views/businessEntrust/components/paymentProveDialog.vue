<template>
	<div class="payment-prove">
		<el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" custom-class="paymentProveDialog">
			<div class="paymentProvePic">
				<img :src="imgUrl" alt="">
			</div>
			<div class="uploadbox">
				<el-upload  class="upload-payment-prove" action="#"
					:limit="1" accept=".jpg,.jpeg,.png" :before-upload="beforePaymentProve"
					:http-request="uploadPaymentProve" style="margin: 10px 0;">
					<el-button slot="trigger" size="small" type="primary">上传支付证明</el-button>
				</el-upload>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { isImgFormat } from "@/utils"
	import baseUrl from '@/request/api'
	
	export default{
		name:'paymentProveDialog',//支付证明
		data(){
			return{
				dialogFormVisible:false,
				imgUrl:""
			}
		},
		methods: {
			uploadPaymentProve() {
				
			},
			//上传前，校验是否为照片格式
			beforePaymentProve(file){
				isImgFormat(file);//调用公共校验方法
			}
		},
		components:{
			
		}
	}
</script>

<style lang="less">
	.payment-prove{
		.paymentProvePic{
			width: 100%;
			height: 450px;
			overflow: auto;
			img{
				width: 100%;
			}
		}
		
		.upload-entrust{
			height: 38px;
			margin: 10px 0;
			min-width: 328px;
		}
		.el-upload-list__item:first-child,
		.el-upload-list__item{
			margin: 0;
		}
		.el-upload{
			width: 20%;
		}
		.el-upload-list{
			display: inline-block;
			width: 70%;
			vertical-align: middle;
			margin-left: 20px;
		}
		.paymentProveDialog{
			width: 70%;
		}
	}
</style>
