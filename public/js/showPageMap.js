// Set up the Mapbox access token using the provided token from your environment or configuration.
mapboxgl.accessToken = mapToken;

// Initialize the Mapbox map.
const map = new mapboxgl.Map({
  container: "map", // Specify the container ID where the map will be displayed.
  style: "mapbox://styles/mapbox/light-v10", // Apply a visual style to the map.
  center: restaurant.geometry.coordinates, // Center the map based on the restaurant's coordinates.
  zoom: 10, // Set the starting zoom level of the map.
});

// Add navigation controls (e.g., zoom in/out buttons) to the map for easier navigation.
map.addControl(new mapboxgl.NavigationControl());

// Create and add a marker to the map for the specific restaurant.
new mapboxgl.Marker()
  .setLngLat(restaurant.geometry.coordinates) // Set the position of the marker based on the restaurant's coordinates.
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // Initialize a new popup with an offset for better visibility.
      .setHTML(
        `<h5>${restaurant.title}</h5><p>${restaurant.location}</p>` // Set the content of the popup with restaurant details.
      )
  )
  .addTo(map); // Finally, add the marker with its associated popup to the map.
