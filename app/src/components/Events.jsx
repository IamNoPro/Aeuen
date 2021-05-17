import React from 'react';
import { useState } from 'react';
import Event from './Event';
import { FaSearch } from 'react-icons/all';
import { Route } from 'react-router-dom';
import EventDetail from './EventDetail';

const Events = ({ type }) => {
	console.log(type);
	const [events, setEvents] = useState([
		{
			id: 0,
			title: 'Big Concert',
			location: 'KAIST Auditorium',
			host: 'Nick',
			date: '10 Aug'
		},
		{
			id: 1,
			title: 'Mix Play',
			location: 'In front of Lotte Cinema',
			host: 'Kim',
			date: '7 Nov'
		},
		{
			id: 2,
			title: 'Sharp Performance',
			location: 'Galleria, Dunsan dong',
			host: 'Ed',
			date: '26 Dec'
		}
	]);

	return (
		<>
			<Route path={`/${type}/:id`}>
				<EventDetail />
			</Route>
			<Route path={`/${type}`} exact>
				<div className={'content'}>
					<div className={'left-content'}>
						<div className="search">
							<input type="text" className="searchTerm" placeholder="Search" />
							<button type="submit" className="searchButton">
								<FaSearch />
							</button>
						</div>
					</div>
					<div className={'mid-content'}>
						<span className={'title'}>Browse other events</span>
						<span>{type}</span>
						<ul className={'events-list'}>
							{events.map(event => {
								return <Event event={event} />;
							})}
						</ul>
					</div>
					<div className={'right-content'}></div>
				</div>
			</Route>
		</>
	);
};

export default Events;
