import React, { useState, useRef, useEffect } from 'react';
import PlacesAutoComplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax


const MyMap = (props) => {
  
	const mapContainer = useRef(null);
	const map = useRef(null);
  const zoom = 4;

	useEffect(() => {
		if (map.current) return;
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			zoom: zoom
		});
		console.log(map);
	});
  
  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
  
    props.setAddress(value);
    props.setCoordinates(latLng);

    map.current.setCenter([latLng['lng'], latLng['lat']]);
    map.current.setZoom(15);
  }

  return (
    <div>
      <PlacesAutoComplete 
        value={props.address} 
        onChange={props.setAddress} 
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input {...getInputProps({ placeholder: "Type address" }) }/>
            
            <div style={{margin: '10px', position: 'absolute', zIndex: 999}}>     
              { loading ? <div>...loading</div> : null }
              
              {suggestions.map(suggestion => {
                const style = {
                  backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
                };
                
                return (
                  <div {...getSuggestionItemProps( suggestion, { style })}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>

            <div className={'map-container'} ref={mapContainer} />
          </div>
        )}
      </PlacesAutoComplete>
    </div>
  );
}

export default MyMap