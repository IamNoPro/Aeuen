import React from 'react';
import {
	AiOutlineCompass,
	BiCalendarCheck,
	BiLogIn,
	BiLogOut,
	AiOutlineForm
} from 'react-icons/all';
import { Link, useLocation } from 'react-router-dom';

function Header(props) {
	let location = useLocation();
	console.log(location.pathname);
	let path = location.pathname.split('/');
	console.log(path);
	return (
		<header>
			<Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
				<span className={'app-name'}> Aeuen </span>
			</Link>
			{/* 
			<Link
				to={'/other-events'}
				className={`first-button my-link ${
					path[1] == 'other-events' ? 'chosen' : ''
				}`}
			>
				<AiOutlineCompass />
				<span style={{ marginLeft: 5 }}> Other Events </span>
			</Link>
			<Link
				to={'/my-events'}
				className={`second-button my-link ${
					path[1] == 'my-events' ? 'chosen' : ''
				}`}
			>
				<BiCalendarCheck />
				<span style={{ marginLeft: 5 }}> My Events </span>
			</Link> */}
			<Link to={'/login'} className="first-button my-link">
				<BiLogIn />
				<span style={{ marginLeft: 5 }}> Log In </span>
			</Link>
			<Link to={'/signup'} className="second-button my-link">
				<AiOutlineForm />
				<span style={{ marginLeft: 5 }}> Sign Up </span>
			</Link>
		</header>
	);
}

export default Header;
