function (doc) {

	function isArray(obj){
		return (Object.prototype.toString.call(obj) === '[object Array]' )
	}

	function getLatestStatus(statusList){
		var latestStatus;
		var status;
		for(var i in statusList){
			status = statusList[i];
			if(status.modified){
				if(!latestStatus){
					latestStatus = status;
				}
				if(new Date(latestStatus.modified) < new Date(status.modified)){
					latestStatus = status;
				}
			}
		}
		return latestStatus.status;
	}

	var activePhone;
  if(isArray(doc.workingPhone) && doc.workingPhone.length > 0){
	  activePhone = getLatestStatus(doc.workingPhone);
  }else{
	  //assume that phone is active(BECAUSE it has not been reported broken)
	  activePhone = true;
  }
	emit(activePhone);
}