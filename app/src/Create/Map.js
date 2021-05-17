import React from 'react';
import PlacesAutoComplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';


export default function MyMap() {
  const [address, setAddress] = React.useState('');
  const [cooordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null
  });

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
  
    setAddress(value);
    setCoordinates(latLng);
  }

  return (
    <div>
      <PlacesAutoComplete 
        value={address} 
        onChange={setAddress} 
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <p>Latitude: {cooordinates.lat}</p>
            <p>Longitude: {cooordinates.lng}</p>

            <input {...getInputProps({ placeholder: "Type address" }) }/>
            
            <div class="dropdown">    
              { loading ? <div>...loading</div> : null }
              
              {suggestions.map(suggestion => {
                const style = {
                  backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
                };
                
                return (
                  <div class="dropdown-menu" {...getSuggestionItemProps( suggestion, { style })}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutoComplete>
    </div>
  );
}