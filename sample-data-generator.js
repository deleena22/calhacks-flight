const fs = require('fs');

// List of predefined callsigns and sample airports for random selection
const predefinedCallsigns = [
  'N621MM', 'N767CJ', 'N713TS', 'N444SC', 'N54QW', 'N4DP', 'N162JC', 'N350XX'
];

// Airport list with correct coordinates (latitude, longitude)
const airports = {
  JFK: { latitude: 40.6413, longitude: -73.7781 }, // John F. Kennedy International Airport, New York
  LAX: { latitude: 33.9416, longitude: -118.4085 }, // Los Angeles International Airport, Los Angeles
  ORD: { latitude: 41.9742, longitude: -87.9073 }, // O'Hare International Airport, Chicago
  DFW: { latitude: 32.8998, longitude: -97.0403 }, // Dallas/Fort Worth International Airport, Dallas
  DEN: { latitude: 39.7392, longitude: -104.9903 }, // Denver International Airport, Denver
  SFO: { latitude: 37.7749, longitude: -122.4194 }, // San Francisco International Airport, San Francisco
  SEA: { latitude: 47.6062, longitude: -122.3321 }, // Seattle-Tacoma International Airport, Seattle
  MIA: { latitude: 25.7617, longitude: -80.1918 }, // Miami International Airport, Miami
  ATL: { latitude: 33.6407, longitude: -84.4279 }, // Hartsfield-Jackson Atlanta International Airport, Atlanta
  LAS: { latitude: 36.0801, longitude: -115.1523 }, // McCarran International Airport, Las Vegas
  BOS: { latitude: 42.3656, longitude: -71.0096 }, // Logan International Airport, Boston
  PHX: { latitude: 33.4342, longitude: -112.0131 } // Phoenix Sky Harbor International Airport, Phoenix
};

// Function to generate random callsign (either from the predefined list or a random one)
const getRandomCallsign = () => {
  return Math.random() < 0.7
    ? predefinedCallsigns[Math.floor(Math.random() * predefinedCallsigns.length)]
    : 'N' + Math.random().toString(36).substr(2, 5).toUpperCase(); // Generate a random callsign
};

const generateFlightData = (numFlights) => {
    return Array.from({ length: numFlights }, () => {
      // Randomly select a departure airport and arrival airport
      const departureAirport = Object.keys(airports)[Math.floor(Math.random() * Object.keys(airports).length)];
      const arrivalAirport = Object.keys(airports)[Math.floor(Math.random() * Object.keys(airports).length)];
  
      // Get the coordinates for the airports (as objects)
      const departureCoords = airports[departureAirport];
      const arrivalCoords = airports[arrivalAirport];
  
      const callsign = getRandomCallsign();
  
      // Return the flight data
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
console.log('500 flights with correct airport coordinates have been written to flights.json');
