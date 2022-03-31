import { get, post } from './http'

const baseUrl='http://192.168.0.103:9092';

export const loginApi = p => post(baseUrl+'/hall/login', p);//登录Api
export const registerApi = p => post(baseUrl+'/hall/register', p);//注册Api
export const captchaApi = p => baseUrl+'/hall/captcha?'+ Math.random();//图形验证码Api
export const phoneCodeApi = p => post(baseUrl+'/hall/sendSms', p);//注册时候手机验证码Api
export const ckUserInfoApi = p => post(baseUrl+'/hall/getCurrentCustomerInfo', p);//验证用户信息