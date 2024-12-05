// Matthias Schäfer, Martin Strohmeier, Vincent Lenders, Ivan Martinovic and Matthias Wilhelm.
// "Bringing Up OpenSky: A Large-scale ADS-B Sensor Network for Research".
// In Proceedings of the 13th IEEE/ACM International Symposium on Information Processing in Sensor Networks (IPSN), pages 83-94, April 2014.


const url = `https://opensky-network.org/api`;

// take data from form
document.getElementById('country-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const country = document.getElementById('country').value.trim().toLowerCase();

    searchByCountry(country);
});

// receive all flights info
async function coverCountry() {
    let response = await fetch(`https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.5226`);
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
            longitude: flight[5],
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
    // console.log(filteredFlights);

    return {filteredFlights, date};
}

// show flights by Country
async function searchByCountry(country) {
    let date = (await displayData()).date;
    let data = (await displayData()).filteredFlights;
    console.log(country);
    data.map(flight => {
        if (flight["originCountry"].trim().toLowerCase() === country) {
            console.log(flight);
        }
    })
}

// Refactor code to get it clean
// Display data in a pleasant way (flight-info + mark on a map)
// Handle styling