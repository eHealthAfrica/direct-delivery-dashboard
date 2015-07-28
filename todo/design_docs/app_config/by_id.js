function (doc) {
	emit(doc._id, {
		_id: doc._id,
		uuid: doc.uuid,
		rev: doc._rev,
		facility: {
			_id: doc.facility._id,
			name: doc.facility.name,
			reminderDay: doc.facility.reminderDay,
			stockCountInterval: doc.facility.stockCountInterval
		}
	});
}