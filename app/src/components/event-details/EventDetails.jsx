import React from 'react';
import Header from '../Header';
import EventPreview from './EventPreview';

const EventDetails = () => {
	return (
		<div>
			<Header />
			<div className="row">
				<div className="col-2 buttons">
					<button type="button" class="btn btn-info action">
						SUGGESTED
					</button>
					<button type="button" class="btn btn-info action">
						<i class="fas fa-music"></i>
						PLAYLIST
					</button>
				</div>
				<div className="col-8 details">
					<h1>Radiant Guitar</h1>
					<EventPreview />
					<img
						src="../../../assets/guitar-concert-poster.png"
						alt="Performance Poster"
						width="450"
						height="450"
					/>

					<h6>Description:</h6>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut cras
						facilisis vel mollis dui at rhoncus cras. Nunc risus felis, id amet
						blandit in viverra id nam. Blandit aliquet sit nulla nunc posuere
						aenean ut. Sit lacus parturient morbi mauris.
					</p>
					<h6>Date: 25th May, Tuesday</h6>
					<h6>Venue:</h6>
				</div>
				<div className="col-2 details">
					<div className="organizers">
						<span>Organizers:</span>
						<br />
						<i class="fas fa-user"></i>
					</div>
					<div className="playlist">
						<span>Playlist:</span>
						<ol>
							<li>Heading West</li>
							<li>Unspoken Peace</li>
							<li>Awaiting</li>
							<li>Betty - Taylor Swift</li>
							<li>Tenerife Sea</li>
						</ol>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventDetails;
