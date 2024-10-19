import fs from 'fs';

// Map of celebrity to plane type
const celebToJet = {
  'TAYLOR_SWIFT': 'FALCON_7X',
  'DRAKE': 'BOEING_767',
  'TRAVIS_SCOTT': 'EMBRAER_190',
  'JAY_Z': 'CHALLENGER_850',
  'OPRAH': 'GULFSTREAM_650',
  'DR_PHIL': 'GULFSTREAM_IV',
  'JIM_CARREY': 'GULFSTREAM_V',
  'TOM_CRUISE': 'CHALLENGER_350',
};

// Map of plane IDs to plane type
const idToJet = {
  'N621MM': 'FALCON_7X',
  'N767CJ': 'BOEING_767',
  'N713TS': 'EMBRAER_190',
  'N444SC': 'CHALLENGER_850',
  'N54QW': 'GULFSTREAM_650',
  'N4DP': 'GULFSTREAM_IV',
  'N162JC': 'GULFSTREAM_V',
  'N350XX': 'CHALLENGER_350',
};

// Map of plane type to CO2 emissions (multiplied by a constant factor for emission rate)
const jetEmissionRates = {
  'FALCON_7X': 1170.04 * 3.16,
  'BOEING_767': 3573.95 * 3.16,
  'EMBRAER_190': 1960.20 * 3.16,
  'CHALLENGER_850': 1051.52 * 3.16,
  'GULFSTREAM_650': 1528.65 * 3.16,
  'GULFSTREAM_IV': 1580.32 * 3.16,
  'GULFSTREAM_V': 1519.53 * 3.16,
  'CHALLENGER_350': 902.60 * 3.16,
};

function calculateCarbonFootprint(planeType, distance) {
    const emissionRatePerHour = jetEmissionRates[planeType];
    if (!emissionRatePerHour) {
      console.error(`Unknown or missing emission rate for plane type: ${planeType}`);
      return 0;
    }
    const flightDuration = distance / 500; // Duration in hours (assuming 500 km/h speed)
    return emissionRatePerHour * flightDuration; // CO2 emissions in kg
  }
  

// Function to aggregate carbon footprint for each celebrity based on flight data
async function aggregateCarbonFootprint() {
  // Read the flights data
  const flightData = JSON.parse(fs.readFileSync('flights.json', 'utf8'));

  // Initialize an object to store the aggregated emissions for each celebrity
  const celebEmissions = {
    'TAYLOR_SWIFT': 0,
    'DRAKE': 0,
    'TRAVIS_SCOTT': 0,
    'JAY_Z': 0,
    'OPRAH': 0,
    'DR_PHIL': 0,
    'JIM_CARREY': 0,
    'TOM_CRUISE': 0,
  };

  // Loop through each flight
  for (const flight of flightData) {
    const planeId = flight.callsign;
    const distance = calculateDistance(flight.departureCoords, flight.arrivalCoords); // Calculate the distance between departure and arrival

    // Debugging output: check if we have valid plane IDs and coordinates
    console.log(`Processing flight with Plane ID: ${planeId}`);
    console.log(`Distance calculated: ${distance} km`);

    // Get the plane type
    const planeType = idToJet[planeId];
    if (!planeType) {
      console.warn(`No plane type found for plane ID: ${planeId}. Skipping flight.`);
      continue;
    }

    // Get the celebrity associated with the flight
    const celebId = Object.keys(celebToJet).find(celeb => celebToJet[celeb] === planeType);
    if (celebId) {
      // Calculate the carbon footprint for the flight
      const carbonFootprint = calculateCarbonFootprint(planeType, distance);
      if (!isNaN(carbonFootprint)) {
        // Add the emissions to the celebrity's total
        celebEmissions[celebId] += carbonFootprint;
        console.log(`${celebId} emissions for this flight: ${carbonFootprint.toFixed(2)} kg CO2e`);
      } else {
        console.error(`Invalid carbon footprint calculation for plane type: ${planeType}`);
      }
    } else {
      console.warn(`No celebrity found for plane type: ${planeType}. Skipping.`);
    }
  }

  // Log the total emissions for each celebrity
  for (const celeb in celebEmissions) {
    console.log(`${celeb}: ${celebEmissions[celeb].toFixed(2)} kg CO2e`);
  }
}

function calculateDistance(departureCoords, arrivalCoords) {
    if (!departureCoords || !arrivalCoords) {
      console.error("Invalid coordinates provided.");
      return 0; // Return 0 if coordinates are missing or invalid
    }
  
    const R = 6371; // Radius of the Earth in km
    const lat1 = departureCoords.latitude;
    const lon1 = departureCoords.longitude;
    const lat2 = arrivalCoords.latitude;
    const lon2 = arrivalCoords.longitude;
  
    const lat1Rad = lat1 * (Math.PI / 180);
    const lon1Rad = lon1 * (Math.PI / 180);
    const lat2Rad = lat2 * (Math.PI / 180);
    const lon2Rad = lon2 * (Math.PI / 180);
  
    const dlat = lat2Rad - lat1Rad;
    const dlon = lon2Rad - lon1Rad;
  
    const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(dlon / 2) * Math.sin(dlon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Distance in km
  }
  
  

// Run the aggregation process
aggregateCarbonFootprint();
