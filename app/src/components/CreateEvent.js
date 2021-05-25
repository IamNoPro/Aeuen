import React, { useState, useRef, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../css/CreateEvent.css';
import { Link } from 'react-router-dom';

import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import PlacesAutoComplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';
  
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import { storage } from '../firebase'
import firebase from "firebase/app";
import "firebase/auth";

const CreateEvent = (props) => {
    let user = firebase.auth().currentUser;
    let events = firebase.firestore().collection('events')
    let users = firebase.firestore().collection('users')

    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedFile, setSelectedFile] = useState({
        name: null,
        file: null
    });
	const [toggleCreateModal, setToggleCreateModal] = useState(false);
    const [address, setAddress] = useState('');
    const [cooordinates, setCoordinates] = useState({
      lat: null,
      lng: null
    });
  
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
    
        setAddress(value);
        setCoordinates(latLng);

        map.current.setCenter([latLng['lng'], latLng['lat']]);
        map.current.setZoom(15);
    }

    const onChangeFile = (event) => {
        console.log('selected file', event.target.files[0]);

        setSelectedFile({
                        name: event.target.files[0].name,
                        file: URL.createObjectURL(event.target.files[0]),
                        raw_file: event.target.files[0]
                    });
    }

    const addFirestore = () => {
        if (!selectedFile.raw_file) return;
        const uploadTask = storage.ref(`images/${selectedFile.name}`).put(selectedFile.raw_file);
        uploadTask.on(
          "state_changed",
          snapshot => {
          },
          error => {
            console.log(error)
          },
          () => {
            storage
              .ref("images")
              .child(selectedFile.name)
              .getDownloadURL()
              .then(url => {
                console.log(url)
                console.log('current user: ' + user)
                console.log('current user uid: ' + user.uid)
                let event = {
                    'title': title,
                    'description': description,
                    'organizers': [user.uid],
                    'location': cooordinates,
                    'location_name': address,
                    'start_date': startDate,
                    'end_date': endDate,
                    'playlist': [],
                    'suggestions': [],
                    'collab_requests': [],
                    'picture': url,
                }


                events.add(event).then(function(eventRef) {
                    users.doc(user.uid).update({
                        'events': firebase.firestore.FieldValue.arrayUnion(eventRef.id)
                    })
                    console.log(eventRef.id)
                })
                console.log(event)
              })
          }
        )
        // add to -> /events/

        
        console.log(title)
        console.log(description)
        console.log(startDate)
        console.log(endDate)
        console.log(selectedFile.name)
        
        console.log(cooordinates)
    }

    return (
        <div className='content'>
            { toggleCreateModal && (
                    <div className={'modal'}> 
                        <div className={'modal-content'}>
                            <span
                                className={'close'}
                                onClick={() => setToggleCreateModal(!toggleCreateModal)}
                            >
                                {' '}
                                &times;
                            </span>
                            <h2> Event Succesfully Created </h2>
                            
                            <div className={'modal-bottom'}>
                                <Link to='/my-events'>
                                    <button
                                        className={'my-modal-button-submit'}
                                        onClick={() => {
                                            setToggleCreateModal(!toggleCreateModal)
                                            addFirestore()
                                        }}
                                    >
                                        {' '}
                                        OK{' '}
                                    </button>
                                </Link>
							</div>
                        </div> 
                    </div>
            )}
                
            <div className='left-content'/>
            <div classname='mid-content container-create'>
                <div className='container-create'>
                    <form className='create-event'>
                        <h1 align='center'>Create a new event</h1>
                        <div className='form-control'>
                            <label>Title</label>
                            <input 
                                type='text' 
                                placeholder='Add Title'
                                value={title}
                                onChange={ (event) => {
                                    setTitle(event.target.value);
                                } }
                            />

                        </div>
                        
                        <div className='form-control'>
                            <label>
                                Poster
                            </label>
                            <label className='form-control-poster' style={{width: selectedFile.file ? '400px' : '150px'}}>
                                { selectedFile.file ? selectedFile.name : 'Upload Picture'} <i className="fa fa-upload"></i> 
                                <input 
                                    id="upload" 
                                    type="file"
                                    accept="image/*"
                                    onChange={onChangeFile}
                                />
                            </label>
                        </div>

                        <div className='form-control form-control-description'>
                            <label>Description</label>
                            <textarea 
                                placeholder='Add Description'
                                value={description}
                                onChange={ (event) => {
                                    setDescription(event.target.value);
                                } }
                            />
                        </div>

                        <div className='form-control'>
                            <label>Start Date & Time</label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DateTimePicker
                                    value={startDate}
                                    onChange={setStartDate}
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </div>

                        <div className='form-control'>
                            <label>End Date & Time</label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DateTimePicker
                                    value={endDate}
                                    onChange={setEndDate}
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                        
                        <div className='form-control'>
                            <label>Location</label>
                            <div>
                                <PlacesAutoComplete 
                                    value={address} 
                                    onChange={setAddress} 
                                    onSelect={handleSelect}
                                >
                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div>
                                        <input {...getInputProps({ placeholder: "Type address" }) }/>
                                        
                                        <div style={{margin: '10px', position: 'absolute', zIndex: 999}}>     
                                            { loading ? <div>...loading</div> : null }
                                            
                                            { suggestions.map(suggestion => {
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
                        </div>
                        
                        <div style={{marginLeft: '150px'}}>
                            <button 
                                type='button' 
                                value='Create Event' 
                                className='my-button' 
                                onClick={() => {
                                    console.log('create event button');
                                    setToggleCreateModal(!toggleCreateModal);
                                }}
                            >
                                <div>Create Event</div>
                            </button>
                        </div>
                    </form>
                    </div>
                </div>
            <div classname='right-content' style={{ marginTop: '100px' }}>
                { selectedFile.file ? <img className='poster' src={selectedFile.file} width={300}></img> : null }
            </div>
        </div>
    )
}

export default CreateEvent;