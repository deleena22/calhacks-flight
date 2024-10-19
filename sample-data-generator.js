const fs = require('fs');

// List of predefined callsigns and sample airports for random selection
const predefinedCallsigns = [
  'N621MM', 'N767CJ', 'N713TS', 'N444SC', 'N54QW', 'N4DP', 'N162JC', 'N350XX'
];

// Airport list with correct coordinates (latitude, longitude)
const airports = {
  JFK: { latitude: 10.6413, longitude: -73.7781 }, // John F. Kennedy International Airport, New York
  LAX: { latitude: 20.9416, longitude: -118.4085 }, // Los Angeles International Airport, Los Angeles
  ORD: { latitude: 14.9742, longitude: -27.9073 }, // O'Hare International Airport, Chicago
  DFW: { latitude: 12.8998, longitude: -57.0403 }, // Dallas/Fort Worth International Airport, Dallas
  DEN: { latitude: 13.7392, longitude: -94.9903 }, // Denver International Airport, Denver
  SFO: { latitude: 17.7749, longitude: -22.4194 }, // San Francisco International Airport, San Francisco
  SEA: { latitude: 47.6062, longitude: -12.3321 }, // Seattle-Tacoma International Airport, Seattle
  MIA: { latitude: 25.7617, longitude: -20.1918 }, // Miami International Airport, Miami
  ATL: { latitude: 13.6407, longitude: -84.4279 }, // Hartsfield-Jackson Atlanta International Airport, Atlanta
  LAS: { latitude: 16.0801, longitude: -115.1523 }, // McCarran International Airport, Las Vegas
  BOS: { latitude: 12.3656, longitude: -71.0096 }, // Logan International Airport, Boston
  PHX: { latitude: 23.4342, longitude: -112.0131 } // Phoenix Sky Harbor International Airport, Phoenix
};

// Function to generate random callsign (with weighted bias towards N621MM)
const getRandomCallsign = () => {
  return Math.random() < 0.5
    ? 'N621MM'  // Give a 50% chance to always pick N621MM
    : predefinedCallsigns[Math.floor(Math.random() * predefinedCallsigns.length)];
};

// Function to calculate distance between two sets of coordinates using the Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const generateFlightData = (numFlights) => {
  return Array.from({ length: numFlights }, () => {
    // Randomly select a departure airport and arrival airport with shorter distances
    let departureAirport, arrivalAirport;
    let distance = 0;
    do {
      // Select two airports, ensuring a shorter distance between them
      departureAirport = Object.keys(airports)[Math.floor(Math.random() * Object.keys(airports).length)];
      arrivalAirport = Object.keys(airports)[Math.floor(Math.random() * Object.keys(airports).length)];
      
      const departureCoords = airports[departureAirport];
      const arrivalCoords = airports[arrivalAirport];
      distance = calculateDistance(
        departureCoords.latitude, departureCoords.longitude,
        arrivalCoords.latitude, arrivalCoords.longitude
      );
    } while (distance > 1000);  // Ensure the flight is less than 1000 km (shorter flight distance)

    const departureCoords = airports[departureAirport];
    const arrivalCoords = airports[arrivalAirport];
    const callsign = getRandomCallsign();

    return { 
      departureCoords,  // Keep as an object with latitude and longitude
      arrivalCoords, 
      callsign, 
      departureAirport, 
      arrivalAirport 
    };
  });
};

// Generate 500 flights and save to flights.json
const flightData = generateFlightData(500);
fs.writeFileSync('flights.json', JSON.stringify(flightData, null, 2), 'utf8');
console.log('500 flights with bias towards N621MM and shorter distances have been written to flights.json');
