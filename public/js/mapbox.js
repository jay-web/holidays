const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log("map box integrated", locations);


mapboxgl.accessToken = 'pk.eyJ1IjoianNkZXZlbG9wZXIiLCJhIjoiY2tpemxnYnlxMmlrMzJ4c2N6cTQ0cnVxZyJ9.GSz0IUv_9wcuy5Yqwv8ldA';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/jsdeveloper/ckj021dw888y019qodu0mrou3',
// center: [ 77.08288978301849, 28.589066849215936],
// scrollZoom: false,
zoom : 5
});

const bounds = new mapboxgl.LngLatBounds();
locations.forEach((loc) => {
    var marker = new mapboxgl.Marker()
    .setLngLat(loc.coordinates)
    .addTo(map);

    new mapboxgl.Popup({
        offset: 30
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<span>Day ${loc.day}: ${loc.description}</span>`)
        .addTo(map)

    bounds.extend(loc.coordinates);
})

map.fitBounds(bounds, {
    padding: {
        top: 150,
        right: 100,
        bottom: 150,
        left: 100
    }
});