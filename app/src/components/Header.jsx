import React from 'react';

const Header = () => {
	return (
		<header className="row">
			<span className="col-8" id="app-title">
				Aeuen
			</span>
			<div className="col-4 header-events">
				<div className="header-event">
					<i className="far fa-lg fa-compass"></i>
					<span>Other Events</span>
				</div>
				<div className="header-event header-selected">
					<i className="far fa-lg fa-calendar-check"></i>
					<span>My Events</span>
				</div>
			</div>
			<hr></hr>
		</header>
	);
};

export default Header;
