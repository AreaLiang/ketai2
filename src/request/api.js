import { get, post ,formDatapost} from './http'

export const baseUrl='http://192.168.0.103:9092/hall';

// export const baseUrlApi=p => baseUrl;

//登录和注册页面
export const loginApi = p => post(baseUrl+'/login', p);//登录Api
export const registerApi = p => post(baseUrl+'/register', p);//注册Api
export const captchaApi = p => baseUrl+'/captcha?'+ Math.random();//图形验证码Api
export const phoneCodeApi = p => post(baseUrl+'/sendSms', p);//注册时候手机验证码Api

//主界面头部 
export const signoutApi = p => post(baseUrl+'/logout', p);//退出登录

//用户信息页面
export const ckUserInfoApi = p => post(baseUrl+'/getCurrentCustomerInfo', p);//验证用户信息
export const cgUserInfoApi = p => post(baseUrl+'/modifyCustomerData', p);//修改客户信息
export const modifyRegistApi = p => post(baseUrl+'/modifyRegist', p);//提交认证
export const uploadCertFileApi = p => formDatapost(baseUrl+'/uploadCertificateFile', p);//证件上传


//业务委托界面
export const bsEntrustmentApi = p => post(baseUrl+'/loadPagingOrders', p);//业务委托页面数据
export const addEntrustOrderApi = p => post(baseUrl+'/newOrderForm', p);//新建业务委托
export const modifyEntrustOrderApi = p => post(baseUrl+'/modifyOrderForm', p);//修改委托单
export const modifyCheckFileApi = p => post(baseUrl+'/modifyCheckFile', p);//完工单保存
export const modifyPayFileApi = p => post(baseUrl+'/modifyPayFile', p);//保存支付证明
export const uploadEntrustOrderApi = p => formDatapost(baseUrl+'/uploadOrderFile', p);//上传业务委托单
export const uploadTempFileApi = p => formDatapost(baseUrl+'/uploadTempFile', p);//上传支付证明、完工单



//密码更改页面
export const pdChangeApi = p => post(baseUrl+'/updatepwd', p);//用户 修改密码