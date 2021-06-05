import React, { useState, useRef, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../css/CreateEvent.css';
import { Link, Route, useParams } from 'react-router-dom';

import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import PlacesAutoComplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';
  
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import { storage } from '../firebase'
import firebase from "firebase/app";
import { auth, db } from '../firebase';

import "firebase/auth";

const EditEvent = () => {
    let user = firebase.auth().currentUser;
    let events = firebase.firestore().collection('events')
    let users = firebase.firestore().collection('users')
    let { id } = useParams();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
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
    const [eventInfo, setEventInfo] = useState(null);

    useEffect(() => {
        db.collection('events')
        .doc(id)
        .get()
        .then(async querySnapshot => {
            let event = querySnapshot.data();
            let copy_event = { ...event };
            copy_event.organizers = await Promise.all(
                event.organizers.map(async organizer => {
                    let userSnapshot = await db
                        .collection('users')
                        .doc(organizer)
                        .get();
                    return {
                        ...userSnapshot.data(),
                        uid: organizer
                    };
                })
            );
            copy_event.id = id;
            setEventInfo(copy_event);
        });
        
        console.log(eventInfo);
    }, [eventInfo]);
    const handleSelect = async (value) => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
    
        setAddress(value);
        setCoordinates(latLng);

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
        if (!selectedFile.raw_file) {
            // TODO
            return;   
        }
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


    console.log('id: ', id);
    return (
        <>
            <div>
                Hello, World!
            </div>
        </>
    )
}

export default EditEvent;
