var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var relationship = require('mongoose-relationship');

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
	minor_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' },
	half_uuid: { type: String, uppercase:true},
	full_uuid: { type: String, unique: uni, uppercase:true},
	store: { type: Schema.Types.ObjectId, ref: "Store", childPath:'beacons' },
	area: { type: Schema.Types.ObjectId, ref: "Area", childPath:'beacon' },
	content: String
});

BeaconSchema.pre('save', function(next) {
	this.half_uuid = this.uuid + this.major_id;
	this.full_uuid = this.uuid + this.major_id + this.minor_id;
	next();
});

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

AreaSchema.pre('save', function (next) {
	console.log('entra al pre save');
  if (this.description === undefined || this.description == null) {
  	this.description = "";
  }
	if (this.x === undefined || this.x == null) {
		this.x = 0;
	}
	if (this.y === undefined || this.y == null) {
		this.y = 0;
	}
	if (this.z === undefined || this.z == null) {
		this.z = 0;
	}
	if (this.unique_id === undefined || this.unique_id == null) {
		this.unique_id = this.store + '-' + this.minor_id;
	}
	next();
});

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
	uuid: { type:String, required: 'Primary UUID is required!', match: UUIDmatch, uppercase: true },
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

StoreSchema.pre('save', function (next) {
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

StoreSchema.plugin(relationship, { relationshipPathName:'client' });

var Store = mongoose.model('Store', StoreSchema);

module.exports.Store = Store;

//===================================================================================================================//
//============ Client Model =========================================================================================//
//===================================================================================================================//

var ClientSchema = new Schema({
	primary_uuid: { type:String, required: 'Primary UUID is required!', unique: uni, match: UUIDmatch, uppercase: true },
	secondary_uuid: { type:String, required: 'Secondary UUID is required!', unique: uni, match: UUIDmatch, uppercase: true },
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

module.exports.Client = mongoose.model('Client', ClientSchema);
