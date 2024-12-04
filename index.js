// Matthias Schäfer, Martin Strohmeier, Vincent Lenders, Ivan Martinovic and Matthias Wilhelm.
// "Bringing Up OpenSky: A Large-scale ADS-B Sensor Network for Research".
// In Proceedings of the 13th IEEE/ACM International Symposium on Information Processing in Sensor Networks (IPSN), pages 83-94, April 2014.


const url = `https://opensky-network.org/api`;

async function coverCountry() {
    let response = await fetch(`https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.5226`);
    let data = await response.json();

    return data;
}

async function displayData() {
    let data = await coverCountry();
    let filteredFlights = data.states.map(flight => {
        return {
            callsign: flight[1],
            velocity: flight[9]
        };
    });
    console.log(filteredFlights);
}

displayData();