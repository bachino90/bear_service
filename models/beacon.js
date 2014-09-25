var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var relationship = require('mongoose-relationship');

var UUIDmatch = [ /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid UUID format" ];
var mini = [0, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'];
var maxi = [65535, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MAX}).'];
var uni = [true, 'Already exist'];

//===================================================================================================================//
//=========== Content Model ==========================================================================================//
//===================================================================================================================//

var BeaconContentSchema = new Schema ({
	image_url: { type: String },
	web_url: { type: String },
	text: { type: String }
});

module.exports.BeaconContent = mongoose.model('BeaconContent',BeaconContentSchema);

//===================================================================================================================//
//=========== Beacon Model ==========================================================================================//
//===================================================================================================================//

var BeaconSchema = new Schema({
	client: { type: Schema.Types.ObjectId, ref: "Client", childPath:'beacons' },
	uuid: { type: String, required: 'UUID is required!', match: UUIDmatch, uppercase: true },
	major_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' },
	minor_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' },
	half_uuid: { type: String, uppercase:true},
	full_uuid: { type: String, unique: uni, uppercase:true},
	store: { type: Schema.Types.ObjectId, ref: "Store", childPath:'beacons' },
	area: { type: Schema.Types.ObjectId, ref: "Area", childPath:'beacon' },
	content: String
});

BeaconSchema.pre('save', function(next) {
	this.half_uuid = this.uuid + this.store.major_id;
	this.full_uuid = this.uuid + this.store.major_id + this.area.minor_id;
	next();
});

BeaconSchema.plugin(relationship, { relationshipPathName:'client' });
BeaconSchema.plugin(relationship, { relationshipPathName:'store' });
BeaconSchema.plugin(relationship, { relationshipPathName:'area' });

var Beacon = mongoose.model('Beacon', BeaconSchema);

module.exports.Beacon = Beacon;

//===================================================================================================================//
//======== Beacon Client Model ======================================================================================//
//===================================================================================================================//

var ClientSchema = new Schema({
	primary_uuid: { type:String, required: 'Primary UUID is required!', unique: uni, match: UUIDmatch, uppercase: true },
	secondary_uuid: { type:String, required: 'Secondary UUID is required!', unique: uni, match: UUIDmatch, uppercase: true },
	name: { type: String, unique: uni },
	stores: [{ type: Schema.Types.ObjectId, ref: 'Store' }],
	beacons: [{ type: Schema.Types.ObjectId, ref: 'Beacon' }]
});

module.exports.Client = mongoose.model('Client', ClientSchema);

//===================================================================================================================//
//============ Area Model ===========================================================================================//
//===================================================================================================================//

var AreaSchema = new Schema({
	store: { type: Schema.Types.ObjectId, ref: '', childPath:'areas' },
	beacon: { type: Schema.Types.ObjectId, ref: 'Beacon' },
	area_name: { type: String, required: 'Area name is required!'},
	minor_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' },
	description: { type: String }
});

AreaSchema.plugin(relationship, { relationshipPathName:'store' });

/*
AreaSchema.post('remove', function(area) {
	Beacon.remove({ _id:  area.beacon._id }, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('Beacon removed');
		}
	});
});
*/
module.exports.Area = mongoose.model('Area', AreaSchema);

//===================================================================================================================//
//============ Store Model ==========================================================================================//
//===================================================================================================================//

var StoreSchema = new Schema({
	beacons: [{ type: Schema.Types.ObjectId, ref: 'Beacon' }],
	client: { type: Schema.Types.ObjectId, ref: "Client", childPath:'stores' },
	store_name: { type: String, required: 'Store name is required!'},
	uuid: { type:String, required: 'Primary UUID is required!', match: UUIDmatch, uppercase: true },
	major_id: { type: Number, min: mini, max: maxi,  required: 'Minor ID is required!' },
	areas: [{ type: Schema.Types.ObjectId, ref: 'Area' }],
	location: {
		latitude: {type: Number},
		longitude: {type: Number}
	}
});

StoreSchema.plugin(relationship, { relationshipPathName:'client' });

module.exports.Store = mongoose.model('Store', StoreSchema);
