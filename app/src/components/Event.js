import React from 'react';
import { BiRightArrowCircle, FiArrowRightCircle } from 'react-icons/all';
import { Link, useHistory } from 'react-router-dom';

function Event({ event, type }) {
	let history = useHistory();
	return (
		<Link
			to={`/${type}/${event.id}`}
			className={'other-event-container my-link'}
		>
			<div id={'vertical-bar'} />
			<div className={'date'}>
				<span> {event.date.split(' ')[0]} </span>
				<span> {event.date.split(' ')[1]} </span>
			</div>
			<div className={'event-content'}>
				<div className={'event-title'}> {event.title} </div>
				<div className={'event-location'}> {event.location} </div>
				{event.host && <div className={'event-host'}> By {event.host} </div>}
			</div>
			<div className={'goto-event-button'}>
				<FiArrowRightCircle size={50} />
			</div>
		</Link>
	);
}

export default Event;
