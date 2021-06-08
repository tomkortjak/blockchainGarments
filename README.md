# Front end

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

## setting up IPFS Pinata
Data on IPFS is stored by nodes and Pinata is a service that can host the node for you 24/7 so you don't have to do that yourself.
Create an account on Pinata and then [create your API key](https://pinata.cloud/documentation#GettingStarted) there.

After creating your key enter the api key and secret in the .env file

## setting up Infura for kovan testnet
Just like Pinata instead of needing to run your own ethereum full node you can use a service like Infura which does that for you
[Create an account there](https://infura.io/) and create a new project
After that go to the settings page and copy the project ID and paste it after "https://kovan.infura.io/v3/ENTER_ID_HERE" in the .env file

## API endpoint
Run API with: 
```
node server.js
```

### uploading a garment
To upload garments using our endpoint you have to make a post request
to the following endpoint.
```
http://127.0.0.1:5000/api/uploadGarment
```
The endpoint can be reached with the following properties defined in
the body (* = Required):
 - garmentType (string `Shirt`) *
 - colorway (string `Pale Blue`) *
 - gender (string `M/F/N`) *
 - originalPricing (string `€ 15,80`) *
 - season (string `SS21`) *
 - fibers (string `animal, artificial, plants, synthetic, etc.`) *
 - coating (string `polyurethane`) *
 - textiles (string `80% polyester, 20% cashmere`) *
 - factory (string `Factory address`) *
 - manufactureDate (string `DD/MM/YYYY`) *
 - designDate (string `DD/MM/YYYY`) *

### Updating a garment
```
http://127.0.0.1:5000/api/updateGarment
```
The following properties can be updated for a garment (* = Required):
 - garmentToken (int) *
 - damageSustained (string)
 - lifeSpan (string `DD/MM/YYYY`) - Filled in upon recycle
 - currentEnvironment (string)
 - returned (boolean)
 - dateOfSale (string `DD/MM/YYYY`)
 - salePrice (string `€ 5,20`)
 - shippingDate (string `DD/MM/YYYY`) 
 - shipper (string)
 - warrantyTime (string `3 months`) 
