import React, { useEffect, useState } from 'react';
import Event from './Event';
import { FaSearch, BsPlusCircle } from 'react-icons/all';
import { Route, Link, Redirect, useLocation } from 'react-router-dom';
import EventDetail from './EventDetail';
import '../css/Events.css';
import { auth, db } from '../firebase';
import firebase from 'firebase/app';

function Notifications(props) {
    let location = useLocation();
	let user_uid = null;
	if (location.state) user_uid = location.state.user_uid;
	if (auth.currentUser) user_uid = auth.currentUser.uid;
	console.log(user_uid);
	const [events, setEvents] = useState(null);	
    const [requests, setRequests] = useState(null);
	let users = firebase.firestore().collection('users');

	let fetchEvents = async () => {
		let querySnapshot = await db.collection('events').get();
		let tmp = [];
		querySnapshot.forEach(doc => {
			if (doc.data().organizers.includes(user_uid)) {
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

        var needed_requests = [];
        for (var i = 0; i < needed_events.length; i++) {
            let event = needed_events[i];
            let reqs = event['collab_requests'];
            if (reqs.length > 0) {
                for (var j = 0; j < reqs.length; j++) {
                    reqs[j]['event_id'] = needed_events[i].id;

                    if (reqs[j]['status'] == 'pending') {
						let userSnapshot = await db
						.collection('users')
						.doc(reqs[j]['user_id'])
						.get();
						
						let user = userSnapshot.data();
						console.log(user);

                        reqs[j]['user'] = user;
                        console.log('!!! ', reqs[j]);
                        needed_requests.push(reqs[j]);
                    }
                }
                console.log(i, reqs);
            }
        }
        console.log(needed_requests);

        setRequests(needed_requests);
    };

	useEffect(() => {
		if (user_uid) {
			setEvents(null);
			setRequests(null);
			fetchEvents();
		}
	}, []);
    
    return (
        <div className={'content'}>
            <div className={'left-content'} />
            
            <div className={'mid-content'}>
				<h2>My collaboration requests:</h2>
				<ul className={'events-list'}>
					{
						(requests && requests.length>0 ? requests.map((request) => (
							<Link
								to={`/my-events/${request.event_id}`}
								className={'other-event-container my-link'}
							>
									<div id={'vertical-bar'} />

									<img className={'poster'} src={request.user.picture} width={100} style={{borderRadius: 50}}></img>
									<div style={{marginLeft: '10px'}}>{request.user.name} sent you request: {request.message}</div>
							</Link>
						)) : (<div>No requests yet.</div>))
					}
				</ul>
            </div>
            <div className={'right-content'} />

        </div>
    )
}

export default Notifications;