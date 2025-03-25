import { useEffect, useRef, useState } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export enum LocationType {
  DeliveryLocation = 'delivery',
  RefuelStation = 'gas_station',
  RestArea = 'rest_area',
  Warehouse = 'warehouse',
  CurrentLocation = 'current'
}

export interface Location {
  id: string;
  type: LocationType;
  position: { lat: number; lng: number };
  name: string;
  address: string;
  description?: string;
}

// Custom hook to initialize and use Google Maps
export function useGoogleMaps(
  mapContainerId: string, 
  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
  zoom: number = 10
) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);
  
  // Initialize the map
  useEffect(() => {
    const initMap = () => {
      if (!document.getElementById(mapContainerId)) return;
      
      const mapOptions: google.maps.MapOptions = {
        center,
        zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      };
      
      mapRef.current = new google.maps.Map(
        document.getElementById(mapContainerId) as HTMLElement,
        mapOptions
      );
      
      setIsLoaded(true);
    };
    
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Script already added and loading
      const googleMapScript = document.getElementById('google-maps-script');
      if (googleMapScript) {
        googleMapScript.addEventListener('load', initMap);
        return () => {
          googleMapScript.removeEventListener('load', initMap);
        };
      }
      
      // Add script if it doesn't exist
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }
    
    return undefined;
  }, [mapContainerId, center, zoom]);
  
  // Function to add markers to the map
  const addMarkers = (locations: Location[]) => {
    if (!mapRef.current || !isLoaded) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Define marker colors based on location type
    const markerColors = {
      [LocationType.DeliveryLocation]: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      [LocationType.RefuelStation]: 'http://maps.google.com/mapfiles/ms/icons/gas.png',
      [LocationType.RestArea]: 'http://maps.google.com/mapfiles/ms/icons/lodging.png',
      [LocationType.Warehouse]: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      [LocationType.CurrentLocation]: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    };
    
    // Create bounds object to fit all markers
    const bounds = new google.maps.LatLngBounds();
    
    // Add new markers
    locations.forEach(location => {
      const marker = new google.maps.Marker({
        position: location.position,
        map: mapRef.current,
        title: location.name,
        icon: markerColors[location.type] || undefined,
      });
      
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <h3>${location.name}</h3>
            <p>${location.address}</p>
            ${location.description ? `<p>${location.description}</p>` : ''}
          </div>
        `,
      });
      
      marker.addListener('click', () => {
        infoWindow.open(mapRef.current, marker);
      });
      
      markersRef.current.push(marker);
      bounds.extend(location.position);
    });
    
    // Fit map to show all markers
    if (locations.length > 0) {
      mapRef.current.fitBounds(bounds);
    }
  };
  
  // Function to draw route between locations
  const drawRoute = async (
    origin: google.maps.LatLngLiteral, 
    destination: google.maps.LatLngLiteral,
    waypoints: google.maps.LatLngLiteral[] = []
  ) => {
    if (!mapRef.current || !isLoaded) return null;
    
    // Create DirectionsService and DirectionsRenderer
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: mapRef.current,
      suppressMarkers: true, // We already have our own markers
    });
    
    // Format waypoints for the DirectionsService
    const formattedWaypoints = waypoints.map(waypoint => ({
      location: waypoint,
      stopover: true,
    }));
    
    try {
      // Request directions
      const result = await directionsService.route({
        origin,
        destination,
        waypoints: formattedWaypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      });
      
      // Display the route
      directionsRenderer.setDirections(result);
      
      return {
        distance: result.routes[0].legs.reduce((total, leg) => total + leg.distance!.value, 0),
        duration: result.routes[0].legs.reduce((total, leg) => total + leg.duration!.value, 0),
        route: result,
      };
    } catch (error) {
      console.error('Error drawing route:', error);
      return null;
    }
  };
  
  // Function to search for nearby places
  const searchNearby = async (
    location: google.maps.LatLngLiteral,
    type: string,
    radius: number = 5000
  ) => {
    if (!mapRef.current || !isLoaded) return [];
    
    const service = new google.maps.places.PlacesService(mapRef.current);
    
    return new Promise<Location[]>((resolve, reject) => {
      service.nearbySearch(
        {
          location,
          radius,
          type,
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const locations: Location[] = results.map((place, index) => ({
              id: `place-${index}-${Date.now()}`,
              type: type === 'gas_station' 
                ? LocationType.RefuelStation 
                : LocationType.RestArea,
              position: {
                lat: place.geometry?.location?.lat() || 0,
                lng: place.geometry?.location?.lng() || 0,
              },
              name: place.name || 'Unknown Place',
              address: place.vicinity || 'No address provided',
            }));
            resolve(locations);
          } else {
            reject(`Places search failed with status: ${status}`);
          }
        }
      );
    });
  };
  
  return {
    map: mapRef.current,
    isLoaded,
    addMarkers,
    drawRoute,
    searchNearby,
  };
}

// Function to geocode an address to coordinates
export async function geocodeAddress(address: string): Promise<google.maps.LatLngLiteral | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}