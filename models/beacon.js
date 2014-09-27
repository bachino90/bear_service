var mongoose     		= require('mongoose');
var Schema       		= mongoose.Schema;
var relationship 		= require('mongoose-relationship');

var uniqueValidator = require('mongoose-unique-validator');

var UUIDmatch = [ /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid UUID format" ];
var mini = [0, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'];
var maxi = [65535, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MAX}).'];
var uni = [true, 'Already exist'];

//===================================================================================================================//
//=========== Content Model =========================================================================================//
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
	minor_id: { type: Number, min: mini, max: maxi,  required: 'Minor ID is required!' },
	half_uuid: { type: String, uppercase:true},
	full_uuid: { type: String, unique: uni, uppercase:true},
	store: { type: Schema.Types.ObjectId, ref: "Store", childPath:'beacons' },
	area: { type: Schema.Types.ObjectId, ref: "Area", childPath:'beacon' },
	content: String
});

BeaconSchema.pre('validate', function(next) {
	this.half_uuid = this.uuid + this.major_id;
	this.full_uuid = this.uuid + this.major_id + this.minor_id;
	next();
});

BeaconSchema.path('full_uuid').index({ unique: true });
BeaconSchema.plugin(uniqueValidator, { message: 'Beacon, {VALUE}, already exist' });
BeaconSchema.plugin(relationship, { relationshipPathName:'client' });
BeaconSchema.plugin(relationship, { relationshipPathName:'store' });
BeaconSchema.plugin(relationship, { relationshipPathName:'area' });

var Beacon = mongoose.model('Beacon', BeaconSchema);

module.exports.Beacon = Beacon;

//===================================================================================================================//
//============ Area Model ===========================================================================================//
//===================================================================================================================//

var AreaSchema = new Schema({
	store: { type: Schema.Types.ObjectId, ref: 'Store', childPath:'areas' },
	beacon: { type: Schema.Types.ObjectId, ref: 'Beacon' },
	area_name: { type: String, required: 'Area name is required!'},
	minor_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' },
	description: { type: String },
	position: {
		x: { type: Number },
		y: { type: Number },
		z: { type: Number }
	},
	unique_id: { type: String, unique: uni }
});

AreaSchema.post('remove', function(doc) {
	console.log('entra para remover el beacon');
	console.log('Area: '+doc);
	Beacon.remove({ _id: doc.beacon }).exec();
});

AreaSchema.pre('validate', function (next) {
	console.log('entra al pre save');
  if (this.description === undefined || this.description == null) {
  	this.description = "";
  }
	if (this.position.x === undefined || this.position.x == null) {
		this.position.x = 0;
	}
	if (this.position.y === undefined || this.position.y == null) {
		this.position.y = 0;
	}
	if (this.position.z === undefined || this.position.z == null) {
		this.position.z = 0;
	}
	if (this.unique_id === undefined || this.unique_id == null) {
		this.unique_id = this.store + '-' + this.minor_id;
	}
	next();
});

AreaSchema.path('unique_id').index({ unique: true });
AreaSchema.plugin(uniqueValidator, { message: 'Minor ID already exist' });
AreaSchema.plugin(relationship, { relationshipPathName:'store' });

var Area = mongoose.model('Area', AreaSchema);

module.exports.Area = Area;

//===================================================================================================================//
//============ Store Model ==========================================================================================//
//===================================================================================================================//

var StoreSchema = new Schema({
	beacons: [{ type: Schema.Types.ObjectId, ref: 'Beacon' }],
	client: { type: Schema.Types.ObjectId, ref: "Client", childPath:'stores' },
	store_name: { type: String, required: 'Store name is required!'},
	uuid: { type:String, required: 'UUID is required!', match: UUIDmatch, uppercase: true },
	major_id: { type: Number, min: mini, max: maxi,  required: 'Minor ID is required!' },
	areas: [{ type: Schema.Types.ObjectId, ref: 'Area' }],
	location: {
		latitude: { type: Number },
		longitude: { type: Number }
	},
	unique_id: { type: String, unique: uni }
});

StoreSchema.post('remove', function(doc) {
	console.log('entra para remover las areas');
	console.log('Store: '+doc);
	Area.find({ store: doc._id }, function(err, areas) {
		if (err) {
			console.log(err);
		} else {
			for (var i=0;i<areas.length;i++) {
				Area.findOne({ _id:areas[i]._id }, function(err, area) {
					if (err) {
						console.log(err);
					} else {
						area.remove();
					}
				});
			}
		}
	});
});

StoreSchema.pre('validate', function (next) {
	if (this.location.latitude === undefined || this.location.latitude == null) {
		this.location.latitude = 0;
	}
	if (this.location.longitude === undefined || this.location.longitude == null) {
		this.location.longitude = 0;
	}
	if (this.unique_id === undefined || this.unique_id == null) {
		this.unique_id = this.client + '-' + this.major_id;
	}
	next();
});

StoreSchema.path('unique_id').index({ unique: true });
StoreSchema.plugin(uniqueValidator, { message: 'Major ID already exist' });
StoreSchema.plugin(relationship, { relationshipPathName:'client' });

var Store = mongoose.model('Store', StoreSchema);

module.exports.Store = Store;

//===================================================================================================================//
//============ Client Model =========================================================================================//
//===================================================================================================================//

var ClientSchema = new Schema({
	uuid: { type:String, required: 'UUID is required!', unique: uni, match: UUIDmatch, uppercase: true },
	name: { type: String, unique: uni },
	stores: [{ type: Schema.Types.ObjectId, ref: 'Store' }],
	beacons: [{ type: Schema.Types.ObjectId, ref: 'Beacon' }]
});

ClientSchema.post('remove', function(doc) {
	console.log('entra para remover el stores');
	console.log('Client: '+doc);
	Store.find({ client: doc._id }, function(err, stores) {
		if (err) {
			console.log(err);
		} else {
			for (var i=0;i<stores.length;i++) {
				Store.findOne({ _id:stores[i]._id }, function(err, store) {
					if (err) {
						console.log(err);
					} else {
						store.remove();
					}
				});
			}
		}
	});
});

ClientSchema.path('uuid').index({ unique: true });
ClientSchema.path('name').index({ unique: true });
ClientSchema.plugin(uniqueValidator, { message: '{VALUE} already exist' });

module.exports.Client = mongoose.model('Client', ClientSchema);

//===================================================================================================================//
//============ Beacon Request Model =================================================================================//
//===================================================================================================================//

var os = 'ANDROID IOS WP'.split(' ')

var BeaconRequestSchema = new Schema({
	beacon_user: { type: Schema.Types.ObjectId, ref: 'BeaconUser' },
	device_os: { type:String, enum:os },
	device_uuid: { type:String },
	client: { type: Schema.Types.ObjectId, ref: 'Client' },
	beacons: [{ type: Schema.Types.ObjectId, ref: 'Beacon' }],
	beacons_rssi: [{
		full_id: { type:String },
		rssi: { type:Number }
	}]
});

module.exports.BeaconRequest = mongoose.model('BeaconRequest', BeaconRequestSchema);

//===================================================================================================================//
//============ Beacon User Model =================================================================================//
//===================================================================================================================//

var BeaconUserSchema = new Schema({

});

module.exports.BeaconUser = mongoose.model('BeaconUser', BeaconUserSchema);
