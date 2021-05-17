import React from 'react';
import './Header.css';
import {AiOutlineCompass, BiCalendarCheck} from "react-icons/all";
import {Link, useLocation} from "react-router-dom";

function Header(props) {
    let location = useLocation();
    console.log(location.pathname);
    let path = location.pathname.split('/');
    console.log(path);
    return (
        <header>
            <Link to={'/'} style={{textDecoration: 'none', color: 'inherit'}}>
                <span className={'app-name'}> Aeuen </span>
            </Link>

            <Link to={'/other-events'} className={`first-button my-link ${path[1] == 'other-events' ? 'chosen' : ''}`}>
                < AiOutlineCompass />
                <span style={{marginLeft: 5}}> Other Events </span>
            </Link>
            <Link to={'/my-events'} className={`second-button my-link ${path[1] == 'my-events' ? 'chosen' : ''}`}>
                < BiCalendarCheck />
                <span style={{marginLeft: 5}}> My Events </span>
            </Link>
        </header>
    );
}

export default Header;