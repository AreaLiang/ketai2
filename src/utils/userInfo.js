//客户信息表单所需要的对象内容
export function userformInfo(data) {
	// 解构赋值
	let {
		contact,
		name,
		mobile,
		phone,
		email,
		address,
		business,
		safetyMobile,
		safetyOfficer
	} = data;

	//表单所需要的对象内容，重新赋值
	let ruleForm = {
		userName: name,
		contactName: contact,
		cellPhone: mobile,
		phone: phone,
		mail: email,
		address: address,
		profession: changeProfessionArray(JSON.parse(business)),
		securityName: safetyOfficer,
		securityPhone: safetyMobile
	}
	
	return ruleForm;
}

//把后台传回来的业务需求转义成中文
function changeProfessionArray(value) {
	let array = [];
	let chArray = {
		dianzi: "电子",
		lvxingcai: "铝型材",
		qipei: "汽配",
		qita: "其他",
		shuini: "水泥",
		taoci: "陶瓷",
		weihuapin: "危化品"
	};
		
	//筛选出 业务需求的 拼音内容，并添加到数组
	for (let i in value) {
		if (value[i]) {
			array.push(i)
		}
	}
	
	//转义，把拼音转义成中文
	array.forEach((item,index)=>{//item 内容是拼音，index是数组索引
		for (let i in chArray) {//i是key 内容是拼音 ,chArray[i]是value 内容是中文
			if (i==item) {//拼音与拼音比较，相等则转义对应的中文
				array[index]=chArray[i];
			}
		}
		
	})
	
	return array;
}
