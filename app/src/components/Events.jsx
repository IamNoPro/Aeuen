import React from 'react';
import { useState } from 'react';
import Event from './Event';
import { FaSearch, BsPlusCircle } from 'react-icons/all';
import { Route, Link } from 'react-router-dom';
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
								<Link to='/create-event'>
									<button type="button" class="btn btn-info action">
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
						<ul className={'events-list'}>
							{events.map(event => {
								return <Event event={event} type={type} />;
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
