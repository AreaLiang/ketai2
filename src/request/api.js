import { get, post ,formDatapost,baseUrl} from './http'

//登录和注册页面
export const loginApi = p => post('hall/login', p);//登录Api
export const registerApi = p => post('hall/register', p);//注册Api
export const captchaApi = p => baseUrl+'hall/captcha?'+ Math.random();//图形验证码Api
export const phoneCodeApi = p => post('hall/sendSms', p);//注册时候手机验证码Api
export const getAreaDataApi = p => post('hall/areas', p);//获取辖区选择


//主界面头部 
export const signoutApi = p => post('hall/logout', p);//退出登录

//用户信息页面
export const ckUserInfoApi = p => post('hall/getCurrentCustomerInfo', p);//验证用户信息
export const cgUserInfoApi = p => post('hall/modifyCustomerData', p);//修改客户信息
export const modifyRegistApi = p => post('hall/modifyRegist', p);//提交认证
export const uploadCertFileApi = p => formDatapost('/hall/uploadCertificateFile', p);//证件上传

//业务委托界面
export const bsEntrustmentApi = p => post('hall/loadPagingOrders', p);//业务委托页面数据
export const addEntrustOrderApi = p => post('hall/createOrder', p);//新建业务委托
export const modifyEntrustOrderApi = p => post('hall/updateOrder', p);//修改委托单
export const previewApi = p => post('hall/preview', p);//预览委托单
export const modifyCheckFileApi = p => post('hall/modifyCheckFile', p);//完工单保存
export const modifyPayFileApi = p => post('hall/modifyPayFile', p);//保存支付证明
export const uploadTempFileApi = p => formDatapost('hall/uploadTempFile', p);//上传支付证明、完工单

//密码更改页面
export const pdChangeApi = p => post('hall/updatepwd', p);//用户 修改密码

//证书管理
export const mgCertificateApi = p => post('hall/queryTaskHis', p);//证书管理列表