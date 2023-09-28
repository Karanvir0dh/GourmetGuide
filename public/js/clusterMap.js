// Set the Mapbox token for authentication
mapboxgl.accessToken = mapToken;

// Initialize a new map instance
const map = new mapboxgl.Map({
  container: "map", // The HTML element to bind the map to
  style: "mapbox://styles/mapbox/light-v11", // Style of the map
  center: [-97.8558, 55.7435], // Initial geographical centerpoint
  zoom: 3, // Initial zoom level
});

// Add navigation controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Execute the following after the map has loaded
map.on("load", () => {
  // Add the restaurants data source to the map, with clustering enabled
  map.addSource("restaurants", {
    type: "geojson",
    data: restaurants,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  // Add a layer to visualize clustered data
  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "restaurants",
    filter: ["has", "point_count"],
    paint: {
      // Define circle color and radius based on cluster point count
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#4DB6AC",
        10,
        "#039BE5",
        30,
        "#0D47A1",
      ],
      "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25],
    },
  });

  // Add a layer to show the number inside clusters
  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "restaurants",
    filter: ["has", "point_count"],
    layout: {
      // Define text properties for the cluster count
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });

  // Add a layer to visualize individual data points
  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "restaurants",
    filter: ["!", ["has", "point_count"]],
    paint: {
      // Define circle properties for individual points
      "circle-color": "#11b4da",
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });

  // Event handler for when a cluster is clicked
  map.on("click", "clusters", (e) => {
    // Fetch information about the clicked cluster and zoom into it
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });    
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("restaurants")
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
       });
      });
  });

  // Event handler for when an individual point is clicked
  map.on("click", "unclustered-point", (e) => {
    // Display a popup with details about the clicked point
    const coordinates = e.features[0].geometry.coordinates.slice();
    const { popUpMarkup } = e.features[0].properties;

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`${popUpMarkup}`)
      .addTo(map);
  });

  // Change the cursor to a pointer when hovering over clusters
  map.on("mouseenter", "clusters", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", () => {
    map.getCanvas().style.cursor = "";
  });
});
