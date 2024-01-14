const express = require('express');
require('dotenv').config();
const shippo = require('shippo')("shippo_test_6b1434047e32cf566ec052161801686255ca9b89");

const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send('Welcome to the Shippo API example!');
});

app.get('/api/shipping-rates', async (req, res) => {
  try {
    // Create addresses for testing purposes
    const addressFrom = await shippo.address.create({
        "name": "Gbogboade Ikechukwu",
        "company": "Total Trailers",
        "street1": "1747 E Auburn Rd",
        "city": "Rochester Hills",
        "state": "MI",
        "zip": "48307",
        "country": "US",
        "phone": "+1 734 829 0776",
        "email": "totaltrailerdev@gmail.com",
    });

    const addressTo = await shippo.address.create({
        "name": "Shawn Ippotle",
        "company": "Shippo",
        "street1": "215 Clayton St.",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94117",
        "country": "US",
        "phone": "+1 555 341 9393",
        "email": "shippotle@shippo.com",
    });

    // Create a shipment with the required details, including the parcel directly
    const shipment = await shippo.shipment.create({
      "address_from": addressFrom.object_id,
      "address_to": addressTo.object_id,
      "parcels": [{ // Add parcel details
        "length": 5,
        "width": 5,
        "height": 5,
        "distance_unit": "in",
        "weight": 2,
        "mass_unit": "lb",
      }],
    });

    // Retrieve shipping rates for the created shipment
    const rates = await shippo.shipment.rates(shipment.object_id);
    res.json(rates);
  } catch (error) {
    console.error('Error getting shipping rates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});