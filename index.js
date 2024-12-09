// Matthias Schäfer, Martin Strohmeier, Vincent Lenders, Ivan Martinovic and Matthias Wilhelm.
// "Bringing Up OpenSky: A Large-scale ADS-B Sensor Network for Research".
// In Proceedings of the 13th IEEE/ACM International Symposium on Information Processing in Sensor Networks (IPSN), pages 83-94, April 2014.


const url = `https://opensky-network.org/api`;

// take data from form and perform API query
function getFlightInfo() {
    document.getElementById('country-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const country = document.getElementById('country').value.trim().toLowerCase();
    
        searchByCountry(country);
    });
}



// receive all flights info
async function coverCountry() {
    let response = await fetch(`https://opensky-network.org/api/states/all?lamin=35.8389&lomin=2.9962&lamax=67.8229&lomax=25.5226`);
    let data = await response.json();

    // console.log(data);
    return data;
}

// get valuable informations about flights
async function displayData() {
    let data = await coverCountry();
    let timestamp = await data.time;
    let date = new Date(timestamp * 1000);

    let filteredFlights = data.states.map(flight => {
        return {
            callsign: flight[1],
            originCountry: flight[2],
            longtitude: flight[5],
            latitude: flight[6],
            baroAltitude: flight[7],
            onGround: flight[8],
            velocity: flight[9],
            trueTrack: flight[10],
            timePosition: flight[3],
            lastContact: flight[4]
        };
    });
    // console.log(date);
    console.log(filteredFlights);

    return {filteredFlights, date};
}
displayData()
// show flights by Country
async function searchByCountry(country) {
    let date = (await displayData()).date;
    let data = (await displayData()).filteredFlights;
    let coordinates = [];
    
    console.log(country);
    data.map(flight => {
        if (flight["originCountry"].trim().toLowerCase() === country) {
            // console.log(flight);
            coordinates.push([flight["latitude"], flight["longtitude"]])
            // console.log(coordinates);
        }
    })

    createMap(51, 10.45, coordinates);
}




// create map
const lat = 51.165691;
const long = 10.451526;
let coordinates = [[50, 10], [52, 11]];

function createMap(lat, long, coordinates) {
    let map = L.map('map').setView([lat, long], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    coordinates.forEach(coordinate => {
        console.log(coordinates)
        L.marker(coordinate).addTo(map)
        .bindPopup(`Marker na współrzędnych ${coordinate}`)
        .openPopup();
    });


}

// createMap(lat, long, coordinates);




getFlightInfo();

// Refactor code to get it clean
    // searchByCountry() - handle double await together ()
    // Change: originCountry !== lat, long. 
// Display data in a pleasant way (flight-info + mark on a map)
// Handle styling


