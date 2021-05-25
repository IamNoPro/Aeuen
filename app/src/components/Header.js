import React, { useState } from 'react';
import {
	AiOutlineCompass,
	BiCalendarCheck,
	BiLogIn,
	BiLogOut,
	AiOutlineForm
} from 'react-icons/all';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import '../css/header.css';

function Header(props) {
	const [userLoggedIn, setUserLoggedIn] = useState(auth.currentUser !== null);
	let location = useLocation();
	console.log(location.pathname);
	let path = location.pathname.split('/');
	console.log(path);

	auth.onAuthStateChanged(function (user) {
		if (user) {
			setUserLoggedIn(true);
		} else {
			setUserLoggedIn(false);
		}
	});

	return (
		<header>
			<Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
				<span className={'app-name'}> Aeuen </span>
			</Link>

			{userLoggedIn && (
				<Link
					to={'/other-events'}
					className={`first-button my-link ${
						path[1] == 'other-events' ? 'chosen' : ''
					}`}
				>
					<AiOutlineCompass />
					<span style={{ marginLeft: 5 }}> Other Events </span>
				</Link>
			)}
			{userLoggedIn && (
				<Link
					to={'/my-events'}
					className={`second-button my-link ${
						path[1] == 'my-events' ? 'chosen' : ''
					}`}
				>
					<BiCalendarCheck />
					<span style={{ marginLeft: 5 }}> My Events </span>
				</Link>
			)}

			{userLoggedIn && (
				<Link
					to={'/'}
					onClick={() =>
						auth
							.signOut()
							.then(() => {
								// Sign-out successful.
							})
							.catch(error => {
								// An error happened.
								console.log(error);
							})
					}
					className={`second-button my-link ${
						path[1] == 'my-events' ? 'chosen' : ''
					}`}
				>
					<BiLogOut />
					<span style={{ marginLeft: 5 }}> Log out </span>
				</Link>
			)}

			{!userLoggedIn && (
				<Link to={'/login'} className="first-button my-link">
					<BiLogIn />
					<span style={{ marginLeft: 5 }}> Log In </span>
				</Link>
			)}
			{!userLoggedIn && (
				<Link to={'/signup'} className="second-button my-link">
					<AiOutlineForm />
					<span style={{ marginLeft: 5 }}> Sign Up </span>
				</Link>
			)}
		</header>
	);
}

export default Header;
