import React, { useState, useRef, useEffect } from 'react';
import {
	BsCheckCircle,
	BsMusicNoteBeamed,
	BsMusicNoteList,
	FaHandsHelping,
	MdLibraryMusic
} from 'react-icons/all';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

function EventDetail({ type }) {
	let [toggleSuggestModal, setToggleSuggestModal] = useState(false);
	let [toggleRequestModal, setToggleRequestModal] = useState(false);

	let [suggestedSong, setSuggestedSong] = useState(false);
	let [requestedCollaboration, setRequestedCollaboration] = useState(false);
	// let [toggleRequestModal, setToggleRequestModal] = useState(false);

	const mapContainer = useRef(null);
	const map = useRef(null);
	const zoom = 4;
	const [eventInfo, setEventInfo] = useState({
		id: 0,
		title: 'Big Concert',
		location: 'KAIST Auditorium',
		host: 'Nick',
		date: '10th August, Friday',
		poster: 'https://i.imgur.com/RK76Ejg.jpeg',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ad aliquid laboriosam minus, nisi reiciendis sit! Distinctio eaque rerum sint. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur ea facilis, laudantium natus nisi nobis repellat suscipit unde! Alias asperiores aspernatur, at beatae corporis doloremque doloribus, dolorum impedit magni minima molestias nam natus neque non quas qui repellat sit. Alias cum earum, hic in molestias nam officiis quasi qui voluptatibus!',
		longitude: -70.9,
		latitude: 42.35,
		organizers: [
			{
				name: 'Nick',
				avatar: 'https://i.imgur.com/Xj5Xlzl.png'
			},
			{
				name: 'Anna',
				avatar: 'https://i.imgur.com/yauts06.png'
			},
			{
				name: 'Ram',
				avatar: 'https://i.imgur.com/xSwipN7.png'
			}
		],
		playlist: [
			'Hammer and Nail',
			'Larger Than Life',
			'Temporary Saint',
			'Dreams',
			'Mule',
			'Beautiful Broken',
			'Revolution Comedy',
			'Creep'
		],
		collaboration_status: 'COLLABORATE'
	});

	useEffect(() => {
		if (map.current) return;
		console.log('entered!!');
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [eventInfo.longitude, eventInfo.latitude],
			zoom: zoom
		});
		console.log(map);
	}, [eventInfo]);

	let modals = [];

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

	return (
		<div className={'content'}>
			{toggleSuggestModal && (
				<div
					id="myModal"
					className={'modal'}
					onClick={() => setToggleSuggestModal(!toggleSuggestModal)}
				>
					<div className={'modal-content'} onClick={e => e.stopPropagation()}>
						<span
							className={'close'}
							onClick={() => setToggleSuggestModal(!toggleSuggestModal)}
						>
							{' '}
							&times;
						</span>
						<h1> Suggest any song </h1>
						<h4> Your suggestion: </h4>
						<input
							className={'my-input'}
							type={'text'}
							placeholder={'Type in the name of your song/songs'}
						/>
						<br />
						<div className={'modal-bottom'}>
							<button
								className={'my-modal-button-submit'}
								onClick={() => {
									setToggleSuggestModal(!toggleSuggestModal);
									setSuggestedSong(true);
								}}
							>
								{' '}
								SUGGEST{' '}
							</button>
							<button
								className={'my-modal-button-cancel'}
								onClick={() => setToggleSuggestModal(!toggleSuggestModal)}
							>
								{' '}
								CANCEL{' '}
							</button>
						</div>
					</div>
				</div>
			)}
			{suggestedSong && (
				<div className={'notification-box'}>
					<BsCheckCircle size={100} />
					<div className={'notification-text'}>
						<h1> Success </h1>
						<h3> Songs were successfully suggested! </h3>
					</div>
				</div>
			)}
			{toggleRequestModal && (
				<div
					id="myModal"
					className={'modal'}
					onClick={() => setToggleRequestModal(!toggleRequestModal)}
				>
					<div className={'modal-content'} onClick={e => e.stopPropagation()}>
						<span
							className={'close'}
							onClick={() => setToggleRequestModal(!toggleRequestModal)}
						>
							{' '}
							&times;
						</span>
						<h1>
							{' '}
							{`Become a collaborator in ${eventInfo.host}'s ${eventInfo.title}!`}{' '}
						</h1>
						<h4> Your message: </h4>
						<input
							className={'my-input'}
							type={'text'}
							placeholder={'Type in something...'}
						/>
						<br />
						<div className={'modal-bottom'}>
							<button
								className={'my-modal-button-submit'}
								onClick={() => {
									setToggleRequestModal(!toggleRequestModal);
									setRequestedCollaboration(true);
									setEventInfo({
										...eventInfo,
										collaboration_status: 'requested'
									});
								}}
							>
								{' '}
								REQUEST{' '}
							</button>
							<button
								className={'my-modal-button-cancel'}
								onClick={() => setToggleRequestModal(!toggleRequestModal)}
							>
								{' '}
								CANCEL{' '}
							</button>
						</div>
					</div>
				</div>
			)}
			{requestedCollaboration && (
				<div className={'notification-box'}>
					<BsCheckCircle size={100} />
					<div className={'notification-text'}>
						<h1> Success </h1>
						<h3> Request was successfully sent! </h3>
					</div>
				</div>
			)}
			<div className={'left-content'}>
				<div className={'vertical'}>
					<button
						type="button"
						className="btn btn-info action"
						onClick={() => setToggleSuggestModal(!toggleSuggestModal)}
					>
						{type === 'my-events' ? (
							<div>
								<div className="icon">
									<BsMusicNoteList />
								</div>
								SUGGESTED
							</div>
						) : (
							<div>
								<div className="icon">
									<MdLibraryMusic />
								</div>
								SUGGEST SONG
							</div>
						)}
					</button>
					<button
						type="button"
						className="btn btn-info action"
						onClick={() => setToggleRequestModal(!toggleRequestModal)}
					>
						{type === 'my-events' ? (
							<div>
								<div className="icon">
									<BsMusicNoteBeamed />
								</div>
								PLAYLIST
							</div>
						) : (
							<div>
								<div className="icon">
									<FaHandsHelping />
								</div>
								{eventInfo.collaboration_status.toUpperCase()}
							</div>
						)}
					</button>
				</div>
			</div>
			<div className={'mid-content'}>
				<span>
					<span className={'title'}>{eventInfo.title}</span>
					<span className={'host-name'}>by {eventInfo.host}</span>
				</span>
				<br />
				<img className={'poster'} src={eventInfo.poster} width={400} />
				<div className={'section'}>
					<div className={'section-title'}> Description: </div>
					<div className={'section-content'}> {eventInfo.description} </div>
				</div>
				<div className={'section'}>
					<div className={'section-title'}> Date: </div>
					<div className={'section-content'}> {eventInfo.date} </div>
				</div>
				<div className={'section'}>
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
									className={'organizer-avatar'}
									src={organizer.avatar}
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
						{eventInfo.playlist.map((music, index) => {
							return <div> {`${index}. ${music}`} </div>;
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default EventDetail;
