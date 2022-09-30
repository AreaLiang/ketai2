import { get, post ,formDatapost} from './http'

export const baseUrl='http://192.168.0.103:9092/';
// export const baseUrl='http://ywdt.gdketai.com/api/';
// export const baseUrl='/api/';

//登录和注册页面
export const loginApi = p => post(baseUrl+'hall/login', p);//登录Api
export const registerApi = p => post(baseUrl+'hall/register', p);//注册Api
export const captchaApi = p => baseUrl+'hall/captcha?'+ Math.random();//图形验证码Api
export const phoneCodeApi = p => post(baseUrl+'hall/sendSms', p);//注册时候手机验证码Api

//主界面头部 
export const signoutApi = p => post(baseUrl+'hall/logout', p);//退出登录

//用户信息页面
export const ckUserInfoApi = p => post(baseUrl+'hall/getCurrentCustomerInfo', p);//验证用户信息
export const cgUserInfoApi = p => post(baseUrl+'hall/modifyCustomerData', p);//修改客户信息
export const modifyRegistApi = p => post(baseUrl+'hall/modifyRegist', p);//提交认证
export const uploadCertFileApi = p => formDatapost(baseUrl+'/hall/uploadCertificateFile', p);//证件上传

//业务委托界面
export const bsEntrustmentApi = p => post(baseUrl+'hall/loadPagingOrders', p);//业务委托页面数据
export const addEntrustOrderApi = p => post(baseUrl+'hall/createOrder', p);//新建业务委托
export const modifyEntrustOrderApi = p => post(baseUrl+'hall/updateOrder', p);//修改委托单
export const previewApi = p => post(baseUrl+'hall/preview', p);//预览委托单
export const modifyCheckFileApi = p => post(baseUrl+'hall/modifyCheckFile', p);//完工单保存
export const modifyPayFileApi = p => post(baseUrl+'hall/modifyPayFile', p);//保存支付证明
export const uploadTempFileApi = p => formDatapost(baseUrl+'hall/uploadTempFile', p);//上传支付证明、完工单

//密码更改页面
export const pdChangeApi = p => post(baseUrl+'hall/updatepwd', p);//用户 修改密码

//证书管理
export const mgCertificateApi = p => post(baseUrl+'hall/queryTaskHis', p);//证书管理列表