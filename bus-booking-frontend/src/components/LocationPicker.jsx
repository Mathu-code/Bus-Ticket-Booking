import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- 1. Fix default marker icon for Leaflet ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png"
});

// --- 2. Function to convert coordinates to place name using OpenStreetMap Nominatim API ---
const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    const data = await response.json();

    // Extract useful address information
    if (data.address) {
      const address = data.address;
      const placeName =
        address.amenity ||
        address.building ||
        address.road ||
        address.village ||
        address.town ||
        address.city ||
        address.district ||
        address.state ||
        data.display_name ||
        "Selected Location";

      return {
        name: placeName,
        fullAddress: data.display_name || placeName
      };
    }
    return { name: "Selected Location", fullAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}` };
  } catch (error) {
    console.error("Error fetching address:", error);
    return { name: "Selected Location", fullAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}` };
  }
};

// --- 3. Custom React-Leaflet Hook for Map Interaction ---
function LocationMarker({ location, onLocationSelect }) {
  const map = useMapEvents({
    // Handle map click to select a new location
    click: async (e) => {
      const { lat, lng } = e.latlng;
      const addressInfo = await getAddressFromCoordinates(lat, lng);

      onLocationSelect({
        lat: lat,
        lng: lng,
        address: addressInfo.name,
        fullAddress: addressInfo.fullAddress
      });
      map.flyTo(e.latlng, map.getZoom());
    },
    // Keep map centered on the current selection when the component loads
    load: () => {
      if (location) {
        map.setView([location.lat, location.lng], map.getZoom());
      }
    }
  });

  // Ensure map view updates if location changes while map is open
  useEffect(() => {
    if (location && map) {
      map.flyTo([location.lat, location.lng], map.getZoom());
    }
  }, [location, map]);


  // Display the Marker if a location is selected
  return location ? (
    <Marker position={[location.lat, location.lng]} draggable={false}>
      <Popup>
        <div className="text-center">
          <div className="font-bold">{location.address}</div>
          <div className="text-sm text-gray-600">Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}</div>
          <div className="text-sm text-gray-600">{location.fullAddress}</div>
        </div>
      </Popup>
    </Marker>
  ) : null;
}

// --- 4. Main Location Picker Component ---
export default function LocationPicker({ onLocationSelect, location }) {
  const [mapOpen, setMapOpen] = useState(false);
  // Separate loading states for independent button control
  const [currentLocationLoading, setCurrentLocationLoading] = useState(false);
  const [sampleLocationLoading, setSampleLocationLoading] = useState(false);
  const defaultCenter = [9.6615, 80.7855]; // Default center (Jaffna, Sri Lanka)

  // Location handler for map clicks (just calls the prop)
  const handleMapLocationSelect = (selectedLocation) => {
    onLocationSelect(selectedLocation);
  };

  // Handler for 'Pick Sample Location' (uses its own loading state)
  const handleSampleLocation = async () => {
    setSampleLocationLoading(true);
    try {
      const sampleLat = defaultCenter[0];
      const sampleLng = defaultCenter[1];

      const addressInfo = await getAddressFromCoordinates(sampleLat, sampleLng);

      onLocationSelect({
        lat: sampleLat,
        lng: sampleLng,
        address: addressInfo.name,
        fullAddress: addressInfo.fullAddress
      });
    } catch (error) {
      console.error("Error selecting sample location:", error);
      alert("Failed to select sample location. Please try again.");
    } finally {
      setSampleLocationLoading(false);
    }
  };

  // Handler for 'Use Current Location' (uses its own loading state)
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    setCurrentLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log("Current Location obtained:", latitude, longitude);

          // Get human-readable address from coordinates
          const addressInfo = await getAddressFromCoordinates(latitude, longitude);

          // Select the location and send it to the parent component/backend
          onLocationSelect({
            lat: latitude,
            lng: longitude,
            address: addressInfo.name,
            fullAddress: addressInfo.fullAddress
          });

          alert("Current location successfully loaded!");
        } catch (error) {
          console.error("Error processing location:", error);
          alert("Failed to process your location. Please try again.");
        } finally {
          setCurrentLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error.code, error.message);
        let errorMessage = "Unable to retrieve your location.";

        if (error.code === 1) { // PERMISSION_DENIED
          errorMessage = "Permission denied. Please enable location access in your browser settings.";
        } else if (error.code === 2) { // POSITION_UNAVAILABLE
          errorMessage = "Location information is unavailable. Please try 'Pick from Map' instead.";
        } else if (error.code === 3) { // TIMEOUT
          errorMessage = "Location request timed out. Please try again.";
        }

        alert(errorMessage);
        setCurrentLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Determine if any long-running operation is active to disable other buttons (optional)
  const isAnyLoading = currentLocationLoading || sampleLocationLoading;

  return (
    <div className="mb-4">
      <div className="font-bold mb-2">Select Boarding Location:</div>

      <div className="flex gap-2 mb-3 flex-wrap">
        <button
          type="button"
          onClick={handleSampleLocation}
          // Disable only if sample location is loading, or current location is running
          disabled={sampleLocationLoading || currentLocationLoading} 
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
        >
          📍 {sampleLocationLoading ? "Loading..." : "Pick Sample Location"}
        </button>
        <button
          type="button"
          onClick={handleCurrentLocation}
          // Disable only if current location is loading, or sample location is running
          disabled={currentLocationLoading || sampleLocationLoading}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition"
        >
          📍 {currentLocationLoading ? "Loading..." : "Use Current Location"}
        </button>
        <button
          type="button"
          onClick={() => setMapOpen(!mapOpen)}
          // Disable if any location operation is active (prevents map actions during API calls)
          disabled={isAnyLoading}
          className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
        >
          🗺️ {mapOpen ? "Hide Map" : "Pick from Map"}
        </button>
      </div>

      {mapOpen && (
        <div className="mb-3 border rounded overflow-hidden shadow">
          <MapContainer
            center={location ? [location.lat, location.lng] : defaultCenter}
            zoom={location ? 16 : 13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker location={location} onLocationSelect={handleMapLocationSelect} />
          </MapContainer>
          <div className="p-2 bg-gray-100 text-sm text-gray-700">
            Click anywhere on the map to select your boarding point.
          </div>
        </div>
      )}

      {/* Display selected location details */}
      {location && (
        <div className="p-3 bg-green-100 border border-green-400 rounded shadow">
          <div className="text-green-700">
            <strong>✓ Location Selected:</strong>
          </div>
          <div className="text-sm font-semibold text-green-800 mt-1">
            {location.address}
          </div>
          <div className="text-xs text-green-700 mt-2 break-words">
            {location.fullAddress}
          </div>
          <div className="text-xs text-green-500 mt-1">
            (Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)})
          </div>
        </div>
      )}
    </div>
  );
}