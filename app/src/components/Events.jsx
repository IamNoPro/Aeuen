import React, { useEffect } from 'react';
import { useState } from 'react';
import Event from './Event';
import { FaSearch, BsPlusCircle } from 'react-icons/all';
import { Route, Link, Redirect, useLocation } from 'react-router-dom';
import EventDetail from './EventDetail';
import '../css/Events.css';
import { auth, db } from '../firebase';

// [
// 	{
// 		id: 0,
// 		title: 'Big Concert',
// 		location: 'KAIST Auditorium',
// 		host: 'Nick',
// 		date: '10 Aug'
// 	},
// 	{
// 		id: 1,
// 		title: 'Mix Play',
// 		location: 'In front of Lotte Cinema',
// 		host: 'Kim',
// 		date: '7 Nov'
// 	},
// 	{
// 		id: 2,
// 		title: 'Sharp Performance',
// 		location: 'Galleria, Dunsan dong',
// 		host: 'Ed',
// 		date: '26 Dec'
// 	}
// ]

const Events = ({ type }) => {
	let location = useLocation();
	let user_uid = null;
	if (location.state) user_uid = location.state.user_uid;
	if (auth.currentUser) user_uid = auth.currentUser.uid;
	console.log(user_uid);
	const [events, setEvents] = useState(null);
	let fetchEvents = async () => {
		let querySnapshot = await db.collection('events').get();
		let tmp = [];
		querySnapshot.forEach(doc => {
			if (doc.data().organizers.includes(user_uid) && type === 'my-events') {
				tmp.push({ ...doc.data(), id: doc.id });
			} else if (
				!doc.data().organizers.includes(user_uid) &&
				type === 'other-events'
			) {
				tmp.push({ ...doc.data(), id: doc.id });
			}
		});
		let needed_events = await Promise.all(
			tmp.map(async event => {
				let copy_event = { ...event };
				copy_event.organizers = await Promise.all(
					event.organizers.map(async organizer => {
						let userSnapshot = await db
							.collection('users')
							.doc(organizer)
							.get();
						return userSnapshot.data();
					})
				);
				return copy_event;
			})
		);
		needed_events.sort(function (a, b) {
			if (a.start_date.seconds > b.start_date.seconds) return 1;
			if (a.start_date.seconds < b.start_date.seconds) return -1;
			return 0;
		});
		console.log(needed_events);
		setEvents(needed_events);
	};

	useEffect(() => {
		if (user_uid) {
			setEvents(null);
			fetchEvents();
		}
	}, [type]);
	if (!user_uid) return <Redirect to={{ pathname: '/login' }} />;
	return (
		<>
			<Route path={`/${type}/:id`}>
				<EventDetail type={type} />
			</Route>
			<Route path={`/${type}`} exact>
				<div className={'content'}>
					<div className={'left-content'}>
						{type === 'other-events' ? (
							<div className="search">
								<input
									type="text"
									className="searchTerm"
									placeholder="Search"
								/>
								<button type="submit" className="searchButton">
									<FaSearch />
								</button>
							</div>
						) : (
							<div>
								<Link to="/create-event">
									<button type="button" className="btn btn-info action">
										<div className="icon">
											<BsPlusCircle />
										</div>
										Create
									</button>
								</Link>
							</div>
						)}
					</div>
					<div className={'mid-content'}>
						<span className={'title'}>
							{type === 'my-events' ? 'My Events' : 'Other Events'}
						</span>
						{events === null ? (
							<div className="centered spinner-border" role="status">
								<span className="sr-only">Loading...</span>
							</div>
						) : events.length === 0 ? (
							<div className={'centered'}>
								<span> No events here yet! </span>
							</div>
						) : (
							<ul className={'events-list'}>
								{events.map(event => {
									return <Event key={event.id} event={event} type={type} />;
								})}
							</ul>
						)}
					</div>
					<div className={'right-content'}></div>
				</div>
			</Route>
		</>
	);
};

export default Events;
