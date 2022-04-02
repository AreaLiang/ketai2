import { get, post ,formDatapost} from './http'

const baseUrl='http://192.168.0.103:9092/hall';

//登录和注册页面
export const loginApi = p => post(baseUrl+'/login', p);//登录Api
export const registerApi = p => post(baseUrl+'/register', p);//注册Api
export const captchaApi = p => baseUrl+'/captcha?'+ Math.random();//图形验证码Api
export const phoneCodeApi = p => post(baseUrl+'/sendSms', p);//注册时候手机验证码Api

//用户信息页面
export const ckUserInfoApi = p => post(baseUrl+'/getCurrentCustomerInfo', p);//验证用户信息
export const uploadCertFileApi = p => formDatapost(baseUrl+'/uploadCertificateFile', p);//用户 信息修改的证件上传

//密码更改页面
export const pdChangeApi = p => post(baseUrl+'/updatepwd', p);//用户 修改密码