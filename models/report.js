var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var Report  = mongoose.model('Report',{
	created_at: {
		type: Date
	},
	entry_id: {
		type: String
	},
	field1: {
		type: String
	}
});

module.exports = {
  Report
};
