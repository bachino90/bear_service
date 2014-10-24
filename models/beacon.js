var mongoose     		= require('mongoose');
var Schema       		= mongoose.Schema;
var relationship 		= require('mongoose-relationship');

var uniqueValidator = require('mongoose-unique-validator');

var UUIDmatch = [ /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Invalid UUID format" ];
var mini = [1, 'The value {VALUE} is beneath the limit {MIN}.'];
var maxi = [65535, 'The value {VALUE} is beneath the limit {MAX}.'];
var uni = [true, 'Already exist'];

//===================================================================================================================//
//=========== Content Model =========================================================================================//
//===================================================================================================================//

var BeaconContentSchema = new Schema ({
	image_url: { type: String },
	web_url: { type: String },
	video_url: { type: String },
	audio_url: { type: String },
	audio_streaming_url: { type: String },
	video_streaming_url: { type: String },
	info_text: { type: String }
});

var BeaconContent = mongoose.model('BeaconContent',BeaconContentSchema);

module.exports.BeaconContent = BeaconContent;

//===================================================================================================================//
//=========== Beacon Model ==========================================================================================//
//===================================================================================================================//
/*
var BeaconSchema = new Schema({
	client: { type: Schema.Types.ObjectId, ref: "Client", childPath:'beacons' },
	uuid: { type: String, required: 'UUID is required!', match: UUIDmatch, uppercase: true },
	major_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' },
	minor_id: { type: Number, min: mini, max: maxi,  required: 'Minor ID is required!' },
	half_uuid: { type: String, uppercase:true},
	full_uuid: { type: String, unique: uni, uppercase:true},
	store: { type: Schema.Types.ObjectId, ref: "Store", childPath:'beacons' },
	area: { type: Schema.Types.ObjectId, ref: "Area", childPath:'beacon' },
	content: {
		image_url: { type: String },
		web_url: { type: String },
		video_url: { type: String },
		audio_url: { type: String },
		audio_streaming_url: { type: String },
		video_streaming_url: { type: String },
		info_text: { type: String }
	}
});

BeaconSchema.pre('validate', function(next) {
	this.half_uuid = this.uuid + "-" + this.major_id;
	this.full_uuid = this.uuid + "-" + this.major_id + "-" + this.minor_id;
	if (this.content.image_url === undefined || this.content.image_url == null) {
		this.content.image_url = "";
	}
	if (this.content.web_url === undefined || this.content.web_url == null) {
		this.content.web_url = "";
	}
	if (this.content.video_url === undefined || this.content.video_url == null) {
		this.content.video_url = "";
	}
	if (this.content.audio_url === undefined || this.content.audio_url == null) {
		this.content.audio_url = "";
	}
	if (this.content.audio_streaming_url === undefined || this.content.audio_streaming_url == null) {
		this.content.audio_streaming_url = "";
	}
	if (this.content.video_streaming_url === undefined || this.content.video_streaming_url == null) {
		this.content.video_streaming_url = "";
	}
	if (this.content.info_text === undefined || this.content.info_text == null) {
		this.content.info_text = "";
	}
	next();
});

BeaconSchema.path('full_uuid').index({ unique: true });
BeaconSchema.plugin(uniqueValidator, { message: 'Beacon, {VALUE}, already exist' });
BeaconSchema.plugin(relationship, { relationshipPathName:'client' });
BeaconSchema.plugin(relationship, { relationshipPathName:'store' });
BeaconSchema.plugin(relationship, { relationshipPathName:'area' });

var Beacon = mongoose.model('Beacon', BeaconSchema);

module.exports.Beacon = Beacon;
*/
//===================================================================================================================//
//============ Beacon Model ===========================================================================================//
//===================================================================================================================//

var BeaconSchema = new Schema({
	uuid: { type: String, required: 'UUID is required!', match: UUIDmatch, uppercase: true },
	major_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' },
	minor_id: { type: Number, min: mini, max: maxi,  required: 'Minor ID is required!' },
	half_uuid: { type: String, uppercase:true},
	full_uuid: { type: String, unique: uni, uppercase:true },
	image: { type:String },
	client: { type: Schema.Types.ObjectId, ref: 'Client' },
	store: { type: Schema.Types.ObjectId, ref: 'Store', childPath:'beacons' },
	beacon_name: { type: String, required: 'Beacon name is required!'},
	namespace: { type: String },
	description: { type: String },
	position: {
		x: { type: Number },
		y: { type: Number },
		z: { type: Number }
	},
	content: {
		image_url: { type: String },
		web_url: { type: String },
		video_url: { type: String },
		audio_url: { type: String },
		audio_streaming_url: { type: String },
		video_streaming_url: { type: String },
		info_text: { type: String }
	}//,unique_id: { type: String, unique: uni }
});

BeaconSchema.post('remove', function(doc) {
	console.log('entra para remover el beacon');
	console.log('Beacon: '+doc);
});

BeaconSchema.pre('validate', function (next) {
	console.log('entra al pre save');
	this.half_uuid = this.uuid + "-" + this.major_id;
	this.full_uuid = this.uuid + "-" + this.major_id + "-" + this.minor_id;
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
	if (this.content.image_url === undefined || this.content.image_url == null) {
		this.content.image_url = "";
	}
	if (this.content.web_url === undefined || this.content.web_url == null) {
		this.content.web_url = "";
	}
	if (this.content.video_url === undefined || this.content.video_url == null) {
		this.content.video_url = "";
	}
	if (this.content.audio_url === undefined || this.content.audio_url == null) {
		this.content.audio_url = "";
	}
	if (this.content.audio_streaming_url === undefined || this.content.audio_streaming_url == null) {
		this.content.audio_streaming_url = "";
	}
	if (this.content.video_streaming_url === undefined || this.content.video_streaming_url == null) {
		this.content.video_streaming_url = "";
	}
	if (this.content.info_text === undefined || this.content.info_text == null) {
		this.content.info_text = "";
	}
	//if (this.unique_id === undefined || this.unique_id == null) {
		//this.unique_id = this.store + '-' + this.minor_id;
	//}
	next();
});

//BeaconSchema.path('unique_id').index({ unique: true });
BeaconSchema.plugin(uniqueValidator, { message: 'Minor ID already exist' });
BeaconSchema.plugin(relationship, { relationshipPathName:'store' });

var Beacon = mongoose.model('Beacon', BeaconSchema);

module.exports.Beacon = Beacon;

//===================================================================================================================//
//============ Store Model ==========================================================================================//
//===================================================================================================================//

var StoreSchema = new Schema({
	image: { type:String },
	client: { type: Schema.Types.ObjectId, ref: "Client", childPath:'stores' },
	store_name: { type: String, required: 'Store name is required!'},
	namespace: { type: String },
	uuid: { type:String, required: 'UUID is required!', match: UUIDmatch, uppercase: true },
	major_id: { type: Number, min: mini, max: maxi,  required: 'Major ID is required!' },
	beacons: [{ type: Schema.Types.ObjectId, ref: 'Beacon' }],
	location: {
		latitude: { type: Number },
		longitude: { type: Number }
	},
	address: { type:String },
	layout: [{
		x: { type:Number },
		y: { type:Number }
	}],
	unique_id: { type: String, unique: uni }
});

StoreSchema.post('remove', function(doc) {
	console.log('entra para remover las beacons');
	console.log('Store: '+doc);
	Beacon.find({ store: doc._id }, function(err, beacons) {
		if (err) {
			console.log(err);
		} else {
			for (var i=0;i<beacons.length;i++) {
				Beacon.findOne({ _id:beacons[i]._id }, function(err, beacon) {
					if (err) {
						console.log(err);
					} else {
						beacon.remove();
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
	if (this.layout === undefined || this.layout == null) {
		this.layout = [{x:0,y:0},{x:0,y:10},{x:10,y:10},{x:10,y:0},{x:0,y:0}];
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

var bussiness = 'BRAND APP SHOPPING'.split(' ')

var ClientSchema = new Schema({
	type: { type:String, enum:bussiness, required: 'Client type is required!' },
	image: { type:String },
	uuid: { type:String, required: 'UUID is required!', unique: uni, match: UUIDmatch, uppercase: true },
	name: { type: String, unique: uni },
	subdomain: { type: String, unique: uni },
	brands: [{ type: Schema.Types.ObjectId, ref: 'Brand' }],
	stores: [{ type: Schema.Types.ObjectId, ref: 'Store' }],
	beacons: [{ type: Schema.Types.ObjectId, ref: 'Beacon' }],
	location: {
		latitude: { type: Number },
		longitude: { type: Number }
	},
	address: { type:String }
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

ClientSchema.pre('validate', function (next) {
	if (this.location.latitude === undefined || this.location.latitude == null) {
		this.location.latitude = 0;
	}
	if (this.location.longitude === undefined || this.location.longitude == null) {
		this.location.longitude = 0;
	}
	if (this.address === undefined || this.address == null) {
		this.address = "";
	}
	next();
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
	user: { type: Schema.Types.ObjectId, ref: 'BeaconUser' },
	device_os: { type:String, enum:os },
	device_uuid: { type:String },
	client: { type: Schema.Types.ObjectId, ref: 'Client' },
	store: { type:Schema.Types.ObjectId, ref: 'Store' },
	beacon: { type: Schema.Types.ObjectId, ref: 'Beacon' },
	rssi: { type: Number },
	date: { type: Date },
	test: { type: Boolean, default:false }
});

module.exports.BeaconRequest = mongoose.model('BeaconRequest', BeaconRequestSchema);

//===================================================================================================================//
//============ Brand Model ==========================================================================================//
//===================================================================================================================//

var BrandSchema = new Schema({
	name: { type:String },
	image: { type:String },
	stores: [{ type: Schema.Types.ObjectId, ref: 'Store' }]
});

module.exports.Brand = mongoose.model('Brand', BrandSchema);

//===================================================================================================================//
//============ Beacon User Model ====================================================================================//
//===================================================================================================================//

var BeaconUserSchema = new Schema({

});

module.exports.BeaconUser = mongoose.model('BeaconUser', BeaconUserSchema);
