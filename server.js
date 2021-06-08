var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var serveStatic = require('serve-static');
const multer = require("multer");
const axios = require('axios')
const fs = require('fs');
const FormData = require("form-data");
const pinataSDK = require('@pinata/sdk');
const dotenv = require("dotenv")
dotenv.config()

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app = express();
app.use(serveStatic(__dirname + "/dist"));

var port = process.env.PORT || 5000;
var hostname = process.env.SERVER_HOST_NAME;

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_API_SECRET;
const pinataURL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

const pinata = pinataSDK(pinataApiKey, pinataSecretApiKey);

const upload = multer({
	dest: "src/assets/tmp"
	// you might also want to set some limits: https://github.com/expressjs/multer#limits
});

// enable CORS without external module
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

app.post('/api/uploadGarment', urlencodedParser, async (req, res) => {
	console.log("request body: ", req.body);
	let garment = {
		name: req.body.name,
		size: req.body.size,
		color: req.body.color,
		type: req.body.type,
		originalPricing: req.body.originalPricing,
		season: req.body.season,
		fibers: req.body.fibers,
		coating: req.body.coating,
		textiles: req.body.textiles,
		factory: req.body.factory,
		manufactureDate: req.body.manufactureDate,
		designDate: req.body.designDate,
		imageCID: req.body.imageCID,
		damageSustained: req.body.damageSustained,
		lifeSpan: req.body.lifeSpan,
		currentEnvironment: req.body.currentEnvironment,
		returned: req.body.returned,
		dateOfSale: req.body.dateOfSale,
		salePrice: req.body.salePrice,
		shippingDate: req.body.shippingDate,
		shipper: req.body.shipper,
		warrantyTime: req.body.warrantyTime
	}
	let upload = await uploadGarment(garment);
	res.send(upload);
})

app.post('/api/uploadImage', upload.single("image"), async function (req, res) {
	console.log(req.file);
	// let image = fs.createReadStream(req.file);
	let image = fs.createReadStream(req.file.path);

	// let image = fs.createReadStream('src/assets/tmp/' + req.file.filename);
	let upload = await uploadImage(image, req.file.filename);
	fs.unlink(req.file.path, function (err) {
		console.log(err);
		console.log('unlinked');
	});
	// let upload = await uploadImage(req.body.files);
	console.log("reponse being returned: ", upload)
	res.send(upload);
})

const uploadImage = async (image, name) => {
	let pin = await pinata.pinFileToIPFS(image, {
		pinataMetadata: {
			name: name
		}
	}).then((result) => {
		console.log(result);
		return result;
	}).catch((err) => {
		return err;
	});
	return pin;
}

const uploadGarment = async (garment) => {
	console.log("Garment being uploaded: ", garment)
	let metadata = {
		name: garment.name,
		description: "Token made with AMFI",
		image: `${garment.imageCID}`,
		attributes: [
			{
				"trait_type": "size",
				"value": garment.size,
			},
			{
				"trait_type": "color",
				"value": garment.color,
			},
			{
				"trait_type": "type",
				"value": garment.type,
			},
			{
				"trait_type": "originalPricing",
				"value": garment.originalPricing,
			},
			{
				"trait_type": "season",
				"value": garment.season,
			},
			{
				"trait_type": "fibers",
				"value": garment.fibers,
			},
			{
				"trait_type": "coating",
				"value": garment.coating,
			},
			{
				"trait_type": "textiles",
				"value": garment.textiles,
			},
			{
				"trait_type": "factory",
				"value": garment.factory,
			},
			{
				"trait_type": "manufactureDate",
				"value": garment.manufactureDate,
			},
			{
				"trait_type": "designDate",
				"value": garment.designDate,
			},
			{
				"trait_type": "damageSustained",
				"value": garment.damageSustained,
			},
			{
				"trait_type": "lifeSpan",
				"value": garment.lifeSpan,
			},
			{
				"trait_type": "currentEnvironment",
				"value": garment.currentEnvironment,
			},
			{
				"trait_type": "returned",
				"value": garment.returned,
			},
			{
				"trait_type": "dateOfSale",
				"value": garment.dateOfSale,
			},
			{
				"trait_type": "salePrice",
				"value": garment.salePrice,
			},
			{
				"trait_type": "shippingDate",
				"value": garment.shippingDate,
			},
			{
				"trait_type": "shipper",
				"value": garment.shipper,
			},
			{
				"trait_type": "warrantyTime",
				"value": garment.warrantyTime,
			},
		]
	};

	return await pinata.pinJSONToIPFS(metadata, {}).then((result) => {
		console.log(result);
		return result;
	}).catch((err) => {
		return err;
	});
}
