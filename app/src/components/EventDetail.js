import React, { useState, useRef, useEffect } from 'react';
import {
	BsCheckCircle,
	BsMusicNoteBeamed,
	BsMusicNoteList,
	FaHandsHelping,
	MdLibraryMusic,
	IoPeopleSharp,
	AiFillEdit
} from 'react-icons/all';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import '../css/EventDetail.css';
import { useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import SuggestSong from '../modals/SuggestSong';
import RequestCollaboration from '../modals/RequestCollaboration';
import RequestsList from '../modals/RequestsList';
import SuggestedList from '../modals/SuggestedList';
import Playlist from '../modals/Playlist';


import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import PlacesAutoComplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';

// {
// 	id: 0,
// 		title: 'Big Concert',
// 	location: 'KAIST Auditorium',
// 	host: 'Nick',
// 	date: '10th August, Friday',
// 	poster: 'https://i.imgur.com/RK76Ejg.jpeg',
// 	description:
// 	'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ad aliquid laboriosam minus, nisi reiciendis sit! Distinctio eaque rerum sint. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur ea facilis, laudantium natus nisi nobis repellat suscipit unde! Alias asperiores aspernatur, at beatae corporis doloremque doloribus, dolorum impedit magni minima molestias nam natus neque non quas qui repellat sit. Alias cum earum, hic in molestias nam officiis quasi qui voluptatibus!',
// 		longitude: -70.9,
// 	latitude: 42.35,
// 	organizers: [
// 	{
// 		name: 'Nick',
// 		avatar: 'https://i.imgur.com/Xj5Xlzl.png'
// 	},
// 	{
// 		name: 'Anna',
// 		avatar: 'https://i.imgur.com/yauts06.png'
// 	},
// 	{
// 		name: 'Ram',
// 		avatar: 'https://i.imgur.com/xSwipN7.png'
// 	}
// ],
// 	playlist: [
// 	'Hammer and Nail',
// 	'Larger Than Life',
// 	'Temporary Saint',
// 	'Dreams',
// 	'Mule',
// 	'Beautiful Broken',
// 	'Revolution Comedy',
// 	'Creep'
// ],
// 	collaboration_status: 'COLLABORATE'
// }

function EventDetail({ type }) {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const getCollaborationStatus = () => {
		// TODO
		if (!eventInfo) return 'REQUEST';
		let status = 'REQUEST';
		eventInfo.collab_requests.forEach(collab => {
			if (collab.user_id === auth.currentUser.uid)
				status = collab.status.toUpperCase();
		});
		return status;
	};

	const formatted = date => {
		const monthName = months[date.getMonth()];
		const dayName = days[date.getDay()];
		let hours = String(date.getHours());
		let minutes = String(date.getMinutes());
		if (hours.length < 2) hours = '0' + hours;
		if (minutes.length < 2) minutes = '0' + minutes;
		return `${hours}:${minutes}, ${dayName}, ${date.getDate()} ${monthName} ${date.getFullYear()}`;
	};

	const getLongLat = () => {
		return [
			eventInfo.location.lng ? eventInfo.location.lng : 127.356424,
			eventInfo.location.lat ? eventInfo.location.lat : 36.36849
		];
	};

	let location = useLocation();

	let [toggleSuggestModal, setToggleSuggestModal] = useState(false);
	let [toggleRequestModal, setToggleRequestModal] = useState(false);

	let [suggestedSong, setSuggestedSong] = useState(false);
	let [requestedCollaboration, setRequestedCollaboration] = useState(false);
	// let [toggleRequestModal, setToggleRequestModal] = useState(false);

	let [suggestedSongList, setSuggestedSongList] = useState(false);
	let [playlistModal, setPlaylistModal] = useState(false);

	const mapContainer = useRef(null);
	const map = useRef(null);
	const zoom = 16;
	const [eventInfo, setEventInfo] = useState(null);

	let [editModal, setEditModal] = useState(false);

	let [starting_date, setStartingDate] = useState(null);
	let [ending_date, setEndingDate] = useState(null);

    const [selectedFile, setSelectedFile] = useState({
        name: null,
        file: null
    });
	const onChangeFile = (event) => {
        console.log('selected file', event.target.files[0]);

        setSelectedFile({
                        name: event.target.files[0].name,
                        file: URL.createObjectURL(event.target.files[0]),
                        raw_file: event.target.files[0]
                    });
    }
	
	useEffect(() => {
		if (!eventInfo || !mapContainer.current) return;
		if (map.current) {
			console.log('setting center?');
			map.current.flyTo({
				center: [
					eventInfo.location.lng ? eventInfo.location.lng : 127.356424,
					eventInfo.location.lat ? eventInfo.location.lat : 36.36849
				]
			});
		} else {
			console.log('creating a map!!');
			map.current = new mapboxgl.Map({
				container: mapContainer.current,
				style: 'mapbox://styles/mapbox/streets-v11',
				center: getLongLat(),
				zoom: zoom
			});
			let marker = new mapboxgl.Marker()
				.setLngLat(getLongLat())
				.addTo(map.current);
		}
		// console.log(map);
	}, [eventInfo]);

	useEffect(() => {
		console.log('another useEffect!');
		let tmp = location.pathname.split('/');
		let event_id = tmp[tmp.length - 1];
		db.collection('events')
			.doc(event_id)
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
				copy_event.id = event_id;
				setEventInfo(copy_event);

				setStartingDate(new Date(copy_event.start_date.seconds * 1000));
				setEndingDate(new Date(copy_event.end_date.seconds * 1000));
			});
	}, [location.pathname]);

	if (!eventInfo || !starting_date || !ending_date) {
		return (
			<div className="centered spinner-border" role="status">
				<span className="sr-only">Loading...</span>
			</div>
		);
	}

	let modals = [];
	if (
		type === 'my-events' &&
		eventInfo.organizers[0].uid === auth.currentUser.uid
	) {
		modals = [
			<RequestsList
				key={1}
				setToggleRequestModal={setToggleRequestModal}
				toggleRequestModal={toggleRequestModal}
				eventInfo={eventInfo}
				setEventInfo={setEventInfo}
			/>,
			<SuggestedList
				key={2}
				setToggleSuggestListModal={setSuggestedSongList}
				toggleSuggestListModal={suggestedSongList}
				eventInfo={eventInfo}
				setEventInfo={setEventInfo}
			/>,
			<Playlist
				key={3}
				setTogglePlaylistModal={setPlaylistModal}
				togglePlaylistModal={playlistModal}
				eventInfo={eventInfo}
				setEventInfo={setEventInfo}
			/>
		];
	} else {
		modals = [
			<SuggestSong
				key={1}
				setToggleSuggestModal={setToggleSuggestModal}
				toggleSuggestModal={toggleSuggestModal}
				setSuggestedSong={setSuggestedSong}
				suggestedSong={suggestedSong}
				eventInfo={eventInfo}
				setEventInfo={setEventInfo}
			/>,
			<RequestCollaboration
				key={2}
				setToggleRequestModal={setToggleRequestModal}
				toggleRequestModal={toggleRequestModal}
				setRequestedCollaboration={setRequestedCollaboration}
				requestedCollaboration={requestedCollaboration}
				eventInfo={eventInfo}
				setEventInfo={setEventInfo}
			/>
		];
	}

	if (suggestedSong) {
		setTimeout(() => {
			setSuggestedSong(false);
		}, 5000);
	}

	if (requestedCollaboration) {
		setTimeout(() => {
			setRequestedCollaboration(false);
		}, 5000);
	}

	console.log(getCollaborationStatus());
	console.log(toggleSuggestModal);

	return (
		<div className={'content'}>
			{modals}
			<div className={'left-content'}>
				<div className={'vertical'}>
					{type === 'my-events' &&
					eventInfo.organizers[0].uid === auth.currentUser.uid ? (
						<>
							<button
								type="button"
								className="btn btn-info action"
								onClick={() => setSuggestedSongList(true)}
							>
								<div>
									<div className="icon">
										<BsMusicNoteList />
									</div>
									<span>SUGGESTED</span>

									<span style={{ marginLeft: '30px' }}>
										{eventInfo.suggestions.length}
									</span>
								</div>
							</button>
							<button
								type="button"
								className="btn btn-info action"
								onClick={() => setPlaylistModal(true)}
							>
								<div>
									<div className="icon">
										<BsMusicNoteBeamed />
									</div>
									PLAYLIST
								</div>
							</button>
							<button
								type="button"
								className="btn btn-info action"
								onClick={() => setToggleRequestModal(!toggleRequestModal)}
							>
								<div>
									<div className="icon">
										<IoPeopleSharp />
									</div>
									<span>REQUESTS</span>

									<span style={{ marginLeft: '40px' }}>
										{eventInfo.collab_requests.reduce(
											(accumulator, element) =>
												element.status === 'pending'
													? accumulator + 1
													: accumulator,
											0
										)}
									</span>
								</div>
							</button>
							<button
									type="button"
									className="btn btn-info action"
									onClick={() => setEditModal(!editModal)}
								>
									
									<div>
										<div className="icon">
											<AiFillEdit />
										</div>
										EDIT
									</div>
							</button>
						</>
					) : (
						<>
							<button
								type="button"
								className="btn btn-info action"
								onClick={() => setToggleSuggestModal(!toggleSuggestModal)}
							>
								<div>
									<div className="icon">
										<MdLibraryMusic />
									</div>
									SUGGEST SONG
								</div>
							</button>
							<button
								type="button"
								className={`btn btn-info action ${getCollaborationStatus().toLowerCase()}`}
								onClick={() => setToggleRequestModal(!toggleRequestModal)}
							>
								<div>
									<div className="icon">
										<FaHandsHelping />
									</div>
									{getCollaborationStatus()}
								</div>
							</button>
						</>
					)}
				</div>
			</div>
			<div className={'mid-content'}>
			{(type === 'my-events' && eventInfo.organizers[0].uid === auth.currentUser.uid && editModal) ? (
					<div className='container-create'>

					    <form className='create-event'>

						<div className='form-control'>
                            <label>Title</label>
                            <input 
                                type='text' 
                                placeholder='Add Title'
                                value={eventInfo.title}
                                onChange={ (event) => {
									let copy_event = {...eventInfo};
									copy_event.title = event.target.value;
									console.log(copy_event);
                                    console.log(event.target.value);
									setEventInfo(copy_event);
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
                                value={eventInfo.description}
                                onChange={ (event) => {
									
									let copy_event = {...eventInfo};
									copy_event.description = event.target.value;
									console.log(copy_event);
                                    console.log(event.target.value);
									setEventInfo(copy_event);
                                } }
                            />
                        </div>

                        <div className='form-control'>
                            <label>Start Date & Time</label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DateTimePicker
                                    value={starting_date}
                                    onChange={ (event) => {
										console.log('HERE')
										let copy_event = {...eventInfo};
										copy_event.start_date = event;
										console.log(copy_event);
										console.log(' EVENT = ', event);
										starting_date = event;
										setEventInfo(copy_event);
										setStartingDate(event);
										}
									}
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
                                    value={ending_date}
                                    onChange={ (event) => {
										let copy_event = {...eventInfo};
										copy_event.end_date = event;
										console.log(copy_event);
										console.log(event);
										starting_date = event;
										setEventInfo(copy_event);
										setEndingDate(event);
										console.log('START DATE !!',starting_date);
									} }
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
                                    value={eventInfo.location_name} 
                                    onChange={(event) => {
										
									let copy_event = {...eventInfo};
									copy_event.location_name = event;
									console.log(copy_event);
                                    console.log(event);
									setEventInfo(copy_event);
										console.log(event);
									}} 
                                    onSelect={(event) => {
										let copy_event = {...eventInfo};
										copy_event.location_name = event;
										console.log(copy_event);
										console.log(event);
										setEventInfo(copy_event);
											console.log(event);
									}}
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
									</div>
                                    )}
                                </PlacesAutoComplete>
                            </div>
                        </div>
                        
                        <div style={{marginLeft: '150px'}}>
                            <button 
                                type='button' 
                                value='Confirm' 
                                className='my-button' 
                                onClick={() => {
                                    console.log('create event button');
									setEditModal(!editModal);
								}}
                            >
                                <div>Apply changes</div>
                            </button>
                        </div>
                    </form>
					</div>
				) : (
					<>
						<span>
							<span className={'title'}>{eventInfo.title}</span>
							<span className={'host-name'}>by {eventInfo.organizers[0].name}</span>
						</span>
						<br />
						<img className={'poster'} src={eventInfo.picture} width={400} />
						<div key={1} className={'section'}>
							<div className={'section-title'}> Description: </div>
							<div className={'section-content'}> {eventInfo.description} </div>
						</div>
						<div key={2} className={'section'}>
							<div className={'section-title'}> Starting Date: </div>
							<div className={'section-content'}> {formatted(starting_date)} </div>
						</div>
						<div key={3} className={'section'}>
							<div className={'section-title'}> Ending Date: </div>
							<div className={'section-content'}> {formatted(ending_date)} </div>
						</div>
						<div key={4} className={'section'}>
							<div className={'section-title'}> Venue: </div>
							<div className={'map-container'} ref={mapContainer} />
						</div>
						</>
					)}
				</div>
				
			<div className={'right-content'}>
				<div className={'clickable-section'}>
					{ selectedFile.file && editModal ? <img className='poster' src={selectedFile.file} width={300}></img> : null }

					<div className={'section-title clickable'}> Organizers: </div>
					<div className={'organizers'}>
						{eventInfo.organizers.map(organizer => {
							return (
								<img
									key={organizer.name}
									className={'organizer-avatar'}
									src={
										organizer.picture
											? organizer.picture
											: 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png'
									}
									height={65}
									width={65}
								/>
							);
						})}
					</div>
				</div>
				<div className={'section'}>
					<div className={'section-title clickable'}> Playlist: </div>
					<div className={'section-content'}>
						{eventInfo.playlist.length === 0 ? (
							<div> Not available </div>
						) : (
							eventInfo.playlist.map((music, index) => {
								return <div> {`${index + 1}. ${music}`} </div>;
							})
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default EventDetail;
