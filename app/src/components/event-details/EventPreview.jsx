import React from 'react';

const EventPreview = () => {
	return (
		<div className="row">
			<div className="col-1">
				<div className="vertical-bar"></div>
			</div>
			<div className="col-1 date">
				<span>11</span>
				<span>Sep</span>
			</div>
			<div className="col-3 details">
				<h5>Piano Boom</h5>
				<h6>KAIST Auditorium</h6>
			</div>
			<div className="col-1">
				<i class="fas fa-3x fa-arrow-circle-right"></i>
			</div>
		</div>
	);
};

export default EventPreview;
