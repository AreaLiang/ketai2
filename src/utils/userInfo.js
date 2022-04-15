/**
 * 客户信息表单所需要的对象内容
 * @param {Array} data [后台返回的用户信息]
 * @param {Number} status [因为后台返回来的业务范围数据格式不一样，1是已经认证，0是非认证]
 */
export function userformInfo(data,status) {
	let ruleForm=new userInfoObj(data);//初始化数据
	
	if(status==1){//已经认证
		//业务范围 转义成中文的数组
		ruleForm.profession=changeProfessionArray(ruleForm.profession);
	}else if(status==0){//非认证
		ruleForm.profession=JSON.parse(ruleForm.profession);
	}

	return ruleForm;
}

//把后台传回来的业务需求转义成中文
export function changeProfessionArray(value) {

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
	
	//判断是否为JSON的字符串，如果不是会出错
	if(isJSON(value)){
		value=JSON.parse(value)
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
	
}

//判断是否为JSON的格式字符串
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            JSON.parse(str);
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }
    console.log('业务范围参数不是JSON格式字符串!')    
}


//用户信息界面 初始化数据的 构造函数
function userInfoObj(data){
	this.userName=data.name,
	this.contactName=data.contact,
	this.cellPhone=data.mobile,
	this.phone=data.phone,
	this.mail=data.email,
	this.address=data.address,
	this.profession=data.business,
	this.securityName=data.safetyOfficer,
	this.securityPhone=data.safetyMobile
}