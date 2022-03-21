export function getUserInfo(){
	const api={
	  url: 'http://localhost:8080/api/getData',
	  method: 'get'
	}
	return api;
}