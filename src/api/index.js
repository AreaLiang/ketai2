const port='http://localhost:8080/api';//本地端口

export function getUserInfo(){
	const api={
	  url: port+'/getData',
	  method: 'get'
	}
	return api;
}