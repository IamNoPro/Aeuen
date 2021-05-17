import React from 'react';
import {BiRightArrowCircle, FiArrowRightCircle} from "react-icons/all";
import "./OtherEvent.css";
import {Link, useHistory} from 'react-router-dom';


function OtherEvent({other_event}) {
    let history = useHistory();
    return (
        <Link to={`/other-events/${other_event.id}`} className={'other-event-container my-link'}>
            <div id={'vertical-bar'} />
            <div className={'date'}>
                <span> { other_event.date.split(' ')[0] } </span>
                <span> { other_event.date.split(' ')[1] } </span>
            </div>
            <div className={'event-content'}>
                <div className={'event-title'}> {other_event.title} </div>
                <div className={'event-location'}> {other_event.location} </div>
                <div className={'event-host'}> By {other_event.host} </div>
            </div>
            <div className={'goto-event-button'}>
                <FiArrowRightCircle size={50}/>
            </div>
        </Link>
    );
}

export default OtherEvent;