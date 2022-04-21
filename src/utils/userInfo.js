/**
 * 客户信息表单所需要的对象内容
 * @param {Array} data [后台返回的用户信息] */
export function userformInfo(data) {
	let ruleForm=new userInfoObj(data);//初始化数据
	var re=/^[\u4E00-\u9FA5]+$/;//判断是否为中文
	let changeData;

	//业务范围 转义成中文的数组
	if(isJSON(ruleForm.business)){//如果是JSON的字符串格式
		 changeData=changeProfessionArray(ruleForm.business);//格式为 'xxx':false，既可以使用该方法
		 if(!re.test(changeData[0])){//如果不是上述格式则直接转化JSON格式
			 changeData=JSON.parse(ruleForm.business);
		 }
	}else{
		changeData=ruleForm.business.split(',');//如果是字符串以逗号分割为格式，如 陶瓷,水泥,印染
	}
	ruleForm.business=changeData;
	
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
export function userInfoObj(data){
	this.name=data.name,
	this.contact=data.contact,
	this.mobile=data.mobile,
	this.phone=data.phone,
	this.email=data.email,
	this.address=data.address,
	this.business=data.business,
	this.safetyOfficer=data.safetyOfficer,
	this.safetyMobile=data.safetyMobile
}