import React from 'react';
import './OtherEvents.css';
import {useState} from "react";
import OtherEvent from "./OtherEvent";
import {FaSearch} from "react-icons/all";
import {Route} from "react-router-dom";
import OtherEventDetail from "./OtherEventDetail";

function OtherEvents(props) {
    const [otherEvents, setOtherEvents] = useState([
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
        },
    ]);

    return (
        <>
            <Route path={'/other-events/:id'}>
                <OtherEventDetail/>
            </Route>
            <Route path={'/other-events'} exact>
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
                        <span className={'title'}>
                            Browse other events
                        </span>
                        <ul className={'events-list'}>
                            {
                                otherEvents.map((otherEvent) => {
                                    return <OtherEvent other_event={otherEvent}/>
                                })
                            }
                        </ul>
                    </div>
                    <div className={'right-content'}>
                    </div>
                </div>
            </Route>
        </>
    );
}

export default OtherEvents;