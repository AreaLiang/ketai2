import { get, post } from './http'

const baseUrl='http://192.168.0.103:9092/hall';

export const loginApi = p => post(baseUrl+'/login', p);//登录Api
export const registerApi = p => post(baseUrl+'/register', p);//注册Api
export const captchaApi = p => baseUrl+'/captcha?'+ Math.random();//图形验证码Api
export const phoneCodeApi = p => post(baseUrl+'/sendSms', p);//注册时候手机验证码Api
export const ckUserInfoApi = p => post(baseUrl+'/getCurrentCustomerInfo', p);//验证用户信息
export const pdChangeApi = p => post(baseUrl+'/updatepwd', p);//用户 修改密码