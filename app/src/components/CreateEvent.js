import React, { useState, useRef, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/CreateEvent.css';
import { Link, useHistory } from 'react-router-dom';

import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import PlacesAutoComplete, {
	geocodeByAddress,
	getLatLng
} from 'react-places-autocomplete';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import { storage } from '../firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import axios from 'axios';
import google_places_api from '../APIKeys';

const CreateEvent = props => {
	console.log('create event!!');
	let user = firebase.auth().currentUser;
	let events = firebase.firestore().collection('events');
	let users = firebase.firestore().collection('users');
	let history = useHistory();

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
	const [coordinates, setCoordinates] = useState({
		lat: null,
		lng: null
	});
	const [loading, setLoading] = useState(false);

	const [errors, setErrors] = useState({
		title: '',
		description: '',
		address: '',
		coordinates: '',
		message: ''
	});

	let marker = null;

	const mapContainer = useRef(null);
	const map = useRef(null);
	const zoom = 12;

	useEffect(() => {
		if (map.current) return;
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			zoom: zoom,
			center: [127.3810255, 36.35057]
		});
		map.current.on('style.load', () => {
			map.current.on('click', async e => {
				console.log(e.lngLat);
				console.log(marker);
				if (marker) marker.remove();

				marker = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map.current);
				let resp = await axios.get(
					`https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.lngLat.lat},${e.lngLat.lng}&key=${google_places_api}`
				);
				console.log(resp);
				setAddress(resp.data.results[0].formatted_address);
				setCoordinates({
					lng: e.lngLat.lng,
					lat: e.lngLat.lat
				});
			});
		});
		console.log(map);
	});

	const handleSelect = async value => {
		const results = await geocodeByAddress(value);
		const latLng = await getLatLng(results[0]);

		setErrors({ ...errors, address: '', coordinates: '', message: '' });
		setAddress(value);
		setCoordinates(latLng);

		map.current.setCenter([latLng['lng'], latLng['lat']]);
		map.current.setZoom(15);
	};

	const onChangeFile = event => {
		console.log('selected file', event.target.files[0]);

		setSelectedFile({
			name: event.target.files[0].name,
			file: URL.createObjectURL(event.target.files[0]),
			raw_file: event.target.files[0]
		});
	};

	const addFirestore = () => {
		if (!selectedFile.raw_file) {
			console.log('asdasadsasad');

			let event = {
				title: title,
				description: description,
				organizers: [user.uid],
				location: coordinates,
				location_name: address,
				start_date: startDate,
				end_date: endDate,
				playlist: [],
				suggestions: [],
				collab_requests: []
			};

			events.add(event).then(function (eventRef) {
				users.doc(user.uid).update({
					events: firebase.firestore.FieldValue.arrayUnion(eventRef.id)
				});
				setLoading(false);
				history.push('/my-events');
				console.log(eventRef.id);
			});

			return;
		}

		const uploadTask = storage
			.ref(`images/${selectedFile.name}`)
			.put(selectedFile.raw_file);
		uploadTask.on(
			'state_changed',
			snapshot => {},
			error => {
				console.log(error);
			},
			() => {
				storage
					.ref('images')
					.child(selectedFile.name)
					.getDownloadURL()
					.then(url => {
						console.log(url);
						console.log('current user: ' + user);
						console.log('current user uid: ' + user.uid);
						let event = {
							title: title,
							description: description,
							organizers: [user.uid],
							location: coordinates,
							location_name: address,
							start_date: startDate,
							end_date: endDate,
							playlist: [],
							suggestions: [],
							collab_requests: [],
							picture: url
						};

						events.add(event).then(function (eventRef) {
							users.doc(user.uid).update({
								events: firebase.firestore.FieldValue.arrayUnion(eventRef.id)
							});
							setLoading(false);
							history.push('/my-events');
							console.log(eventRef.id);
						});
						console.log(event);
					});
			}
		);
		// add to -> /events/

		console.log(title);
		console.log(description);
		console.log(startDate);
		console.log(endDate);
		console.log(selectedFile.name);

		console.log(coordinates);
	};

	const onSubmit = () => {
		console.log('create event button');

		let validInputs = true;
		let currentErrors = {
			title: '',
			description: '',
			address: '',
			coordinates: '',
			message: ''
		};
		if (title.length === 0) {
			currentErrors.title = 'Title cannot be empty';
			validInputs = false;
		}
		if (description.length === 0) {
			currentErrors.description = 'Description cannot be empty';
			validInputs = false;
		}
		if (address.length === 0) {
			currentErrors.address = 'Description cannot be empty';
			validInputs = false;
		}
		if (!coordinates.lat) {
			currentErrors.coordinates = 'Coordinates must be set';
			validInputs = false;
		}
		if (!validInputs) {
			console.log('error detected');
			setErrors(currentErrors);
			return;
		}
		setToggleCreateModal(!toggleCreateModal);
	};
	console.log(errors);

	return (
		<div className="content">
			{toggleCreateModal && (
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
							{loading ? (
								<button className={'my-modal-button-submit'} disabled>
									<span
										class="spinner-border spinner-border-sm"
										role="status"
										style={{ marginRight: 5 }}
										aria-hidden="true"
									/>
									Loading...
								</button>
							) : (
								<button
									className={'my-modal-button-submit'}
									onClick={() => {
										setLoading(true);
										addFirestore();
									}}
								>
									OK
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			<div className="left-content" />
			<div className="mid-content container-create">
				<div className="container-create">
					<form className="create-event">
						<h1 align="center">Create a new event</h1>
						{/* {errors.message && (
							<div style={{ color: 'red' }}>{errors.message}</div>
						)} */}
						<div className="form-control">
							<label>Title</label>
							<input
								type="text"
								placeholder="Add Title"
								value={title}
								onChange={event => {
									setErrors({ ...errors, title: '', message: '' });
									setTitle(event.target.value);
								}}
							/>
							{errors.title && (
								<div style={{ color: 'red' }}>{errors.title}</div>
							)}
						</div>

						<div className="form-control">
							<label>Poster</label>
							<label className="form-control-poster">
								{selectedFile.file ? selectedFile.name : 'Upload Picture'}{' '}
								<i className="fa fa-upload"></i>
								<input
									id="upload"
									type="file"
									accept="image/*"
									onChange={onChangeFile}
								/>
							</label>
						</div>

						<div className="form-control form-control-description">
							<label>Description</label>
							<textarea
								placeholder="Add Description"
								value={description}
								onChange={event => {
									setErrors({ ...errors, description: '', message: '' });
									setDescription(event.target.value);
								}}
							/>
							{errors.description && (
								<div style={{ color: 'red' }}>{errors.description}</div>
							)}
						</div>

						<div className="form-control">
							<label>Start Date & Time</label>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<DateTimePicker
									value={startDate}
									onChange={setStartDate}
									InputProps={{
										disableUnderline: true
									}}
								/>
							</MuiPickersUtilsProvider>
						</div>

						<div className="form-control">
							<label>End Date & Time</label>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<DateTimePicker
									value={endDate}
									onChange={setEndDate}
									InputProps={{
										disableUnderline: true
									}}
								/>
							</MuiPickersUtilsProvider>
						</div>

						<div className="form-control">
							<label>Location</label>
							<div>
								<PlacesAutoComplete
									value={address}
									onChange={newAddress => {
										setErrors({ ...errors, address: '', message: '' });
										setAddress(newAddress);
									}}
									onSelect={handleSelect}
								>
									{({
										getInputProps,
										suggestions,
										getSuggestionItemProps,
										loading
									}) => (
										<div>
											<input
												{...getInputProps({ placeholder: 'Type address' })}
											/>
											{errors.address && (
												<div style={{ color: 'red' }}>{errors.address}</div>
											)}

											<div
												style={{
													margin: '10px',
													position: 'absolute',
													zIndex: 999
												}}
											>
												{loading ? <div>...loading</div> : null}

												{suggestions.map(suggestion => {
													const style = {
														backgroundColor: suggestion.active
															? '#41b6e6'
															: '#fff'
													};

													return (
														<div
															{...getSuggestionItemProps(suggestion, { style })}
														>
															{suggestion.description}
														</div>
													);
												})}
											</div>

											<div className={'map-container'} ref={mapContainer} />
											{errors.coordinates && (
												<div style={{ color: 'red' }}>{errors.coordinates}</div>
											)}
										</div>
									)}
								</PlacesAutoComplete>
							</div>
						</div>

						<div style={{ marginLeft: '150px' }}>
							<button
								type="button"
								value="Create Event"
								className="my-button"
								onClick={onSubmit}
							>
								<div>Create Event</div>
							</button>
						</div>
					</form>
				</div>
			</div>
			<div className="right-content" style={{ marginTop: '100px' }}>
				{selectedFile.file ? (
					<img className="poster" src={selectedFile.file} width={300}></img>
				) : null}
			</div>
		</div>
	);
};

export default CreateEvent;
