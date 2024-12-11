// Matthias Schäfer, Martin Strohmeier, Vincent Lenders, Ivan Martinovic and Matthias Wilhelm.
// "Bringing Up OpenSky: A Large-scale ADS-B Sensor Network for Research".
// In Proceedings of the 13th IEEE/ACM International Symposium on Information Processing in Sensor Networks (IPSN), pages 83-94, April 2014.
import './style.css';
import 'modern-normalize';


const url = `https://opensky-network.org/api`;
let map;
// take data from form and perform API query
function getFlightInfo() {
    document.getElementById('country-form').addEventListener('submit', (event) => {
        event.preventDefault();
        // const country = document.getElementById('country').value.trim().toLowerCase();
        const lamin = parseFloat(document.getElementById('lamin').value);
        const lamax = parseFloat(document.getElementById('lamax').value);
        const longmin = parseFloat(document.getElementById('longmin').value);
        const longmax = parseFloat(document.getElementById('longmax').value);

        searchByCountry(lamin, lamax, longmin, longmax);
        hideTable();

    });
}

function hideTable() {
        //show table
        const table = document.getElementById('flightsTable');
        if (table.hidden = true) {
            table.hidden = false;
        } else if (table.hidden = false) {
            table.hidden = true;
        }
}

// receive all flights info
async function coverCountry(lamin, lamax, longmin, longmax) {
    try {
        let response = await fetch(`https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${longmin}&lamax=${lamax}&lomax=${longmax}`);
        if (!response.ok) {
            throw new Error("Can't fetch data:" + response.statusText);
        }

        let data = await response.json();
        if (!data || !data.states || data.states.length === 0) {
            throw new Error("No data available for the given region.");
        }

        return data;
    } catch (error) {
        displayErrorMessage(error.message);
        return null;
    }

}

// display errors
function displayErrorMessage(message) {

    // Checks if the msg already exists
    let existingMessages = document.querySelectorAll('.error-message');
    for (let i = 0; i < existingMessages.length; i++) {
        if (existingMessages[i].innerText === message) {
            return;
        }
    }
    const errorMessageElement = document.createElement('div');
    errorMessageElement.style.position = 'fixed';
    errorMessageElement.style.top = '20px';
    errorMessageElement.style.left = '50%';
    errorMessageElement.style.transform = 'translateX(-50%)';
    errorMessageElement.style.backgroundColor = '#ff4d4d';
    errorMessageElement.style.color = '#fff';
    errorMessageElement.style.padding = '10px 20px';
    errorMessageElement.style.borderRadius = '5px';
    errorMessageElement.style.fontSize = '16px';
    errorMessageElement.style.zIndex = '9999';
    errorMessageElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    errorMessageElement.innerText = message;


    let offset = existingMessages.length * 60; 

    errorMessageElement.style.marginTop = `${offset}px`;
    errorMessageElement.classList.add('error-message');

    document.body.appendChild(errorMessageElement);

    // Erase msg after 5s
    setTimeout(() => {
        errorMessageElement.remove();
    }, 5000); 
}



// get valuable informations about flights
async function displayData(lamin, lamax, longmin, longmax) {
    let data = await coverCountry(lamin, lamax, longmin, longmax);
    if (!data) {
        return null;
    }
    let timestamp = data.time;
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
    return {filteredFlights, date};
}
// show flights by Country
async function searchByCountry(lamin, lamax, longmin, longmax) {
    // Wywołanie displayData raz, wynik jest przechowywany w zmiennej data
    let data = await displayData(lamin, lamax, longmin, longmax);
    if (!data) {
        displayErrorMessage("No data available for the given region.");
        return;
    }
    let {filteredFlights, date} = data;

    let coordinates = [];
    let {lat, long} = avg(lamin, lamax, longmin, longmax);
    // Zbieranie współrzędnych z filteredFlights
    filteredFlights.map(flight => {
        coordinates.push([flight["latitude"], flight["longtitude"]]);
    });
    createMap(lat, long, coordinates); // Wywołanie mapy z współrzędnymi

    console.log(getTopThreeVelocity(filteredFlights));
    console.log(getTopThreeBaroAltitude(filteredFlights));


    renderTable(filteredFlights);
    $(document).ready(function() {
        $('#flightsTable').DataTable();
    });

}


// calculate avg coordinates 
function avg(lamin, lamax, longmin, longmax) {
    console.log(lamin, lamax, longmin, longmax);
    let lat = (lamin + lamax) / 2;
    let long = (longmin + longmax) / 2;

    return {lat, long};
}

function renderTable(data) {
    const tableBody = document.querySelector('#flightsTable tbody');
    tableBody.innerHTML = '';

    data.forEach(flight => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${flight.callsign}</td>
            <td>${flight.originCountry}</td>
            <td>${flight.latitude}</td>
            <td>${flight.longtitude}</td>
            <td>${flight.velocity}</td>
            <td>${flight.baroAltitude}</td>
        `;
        tableBody.appendChild(row);
    });
}


// render map
function createMap(lat, long, coordinates) {
    // make sure to remove map before intialization
    let container = L.DomUtil.get('map');
    if (container != null) {
        container._leaflet_id = null;
    }

    let map = L.map('map').setView([lat, long], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);


    coordinates.forEach(coordinate => {
        L.marker(coordinate).addTo(map)
        .bindPopup(`Marker na współrzędnych ${coordinate}`)
        .openPopup();
    });

}


function getTopThreeVelocity(arr) {
    return arr
        .sort((a,b) => b.velocity - a.velocity)
        .slice(0, 3);
}

function getTopThreeBaroAltitude(arr) {
    return arr
        .sort((a,b) => b.baroAltitude - a.baroAltitude)
        .slice(0, 3);
}

// refresh button
function refresh() {
    const btn = document.getElementById('refresh');
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.reload();
    });
}


getFlightInfo();
refresh();

// Refactor code to get it clean
    // searchByCountry() - handle double await together ()
    // Change: originCountry !== lat, long.       DONE
    // Think of a way to change lat/long input
    // Create tab onMapPoint click() that shows informations
    // Add TOP3 ranking: 1)Velocity 2) Altitude etc....  DONE
    // DIsplay TOP3 
// Display data in a pleasant way (flight-info + mark on a map)
// Handle styling


// Handle map is already initialized error
// Add onClick table row to display pin on map 
