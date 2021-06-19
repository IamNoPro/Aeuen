import React, { useState, useRef, useEffect } from 'react';
import {
	BsCheckCircle,
	BsMusicNoteBeamed,
	BsMusicNoteList,
	FaHandsHelping,
	MdLibraryMusic,
	IoPeopleSharp
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

	useEffect(() => {
		if (!eventInfo) return;
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
			});
	}, [location.pathname]);

	if (!eventInfo) {
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

	let starting_date = new Date(eventInfo.start_date.seconds * 1000);
	let ending_date = new Date(eventInfo.end_date.seconds * 1000);

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
			</div>
			<div className={'right-content'}>
				<div className={'clickable-section'}>
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
				{type === 'my-events' && <span>Number of participants: 100</span>}
			</div>
		</div>
	);
}

export default EventDetail;
