function (doc) {

	function pad(arg) {
		arg = arg + ''; //cast to string
		if(arg && arg.length === 1){
			arg = ['0' , arg].join('');
		}
		return arg;
	}
	var createdDate = new Date(doc.created);
	var year = createdDate.getFullYear();
	var month = pad(createdDate.getUTCMonth() + 1);
	var dateDay = pad(createdDate.getDate());

	var key =  [ year, month, dateDay ].join('-');


	emit(key, doc);
}