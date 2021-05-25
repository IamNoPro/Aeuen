import React from 'react';
import { BiRightArrowCircle, FiArrowRightCircle } from 'react-icons/all';
import { Link, useHistory } from 'react-router-dom';
import '../css/Event.css';

function Event({ event, type }) {
	let month_name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	console.log(event.start_date);
	let date = new Date(event.start_date.seconds * 1000);
	console.log(date);
	return (
		<Link
			to={`/${type}/${event.id}`}
			className={'other-event-container my-link'}
		>
			<div id={'vertical-bar'} />
			<div className={'date'}>
				<span> {date.getDate()} </span>
				<span> {month_name[date.getMonth()]} </span>
			</div>
			<div className={'event-content'}>
				<div className={'event-title'}> {event.title} </div>
				<div className={'event-location'}> {event.location_name} </div>
				{(type === 'other-events') && <div className={'event-host'}> By {event.organizers.map((organizer) => organizer.name).join(', ')} </div>}
			</div>
			<div className={'goto-event-button'}>
				<FiArrowRightCircle size={50} />
			</div>
		</Link>
	);
}

export default Event;
