import Header from './components/Header';
import Events from './components/Events';
import Infosection from './components/InfoSection';
import CreateEvent from './components/CreateEvent';
import {BrowserRouter as Router, Switch, Route, Link, useLocation} from 'react-router-dom';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Login from './components/Login';
import Signup from './components/Signup';
import { auth } from './firebase'
import React, {useEffect, useState} from 'react'
import './css/App.css';
import google_places_api from "./APIKeys";
import Notifications from './components/Notifications';

mapboxgl.accessToken =
	'pk.eyJ1IjoicG9sbHV4eCIsImEiOiJja29qcWEybDQxZWlqMndvOXh5bGJkMXh4In0.-F11fMMGsYF9SMiEG-PP3w';

function App() {
	const [userLoggedIn, setUserLoggedIn] = useState(null);
	auth.onAuthStateChanged(function (user) {
		// console.log(user)
		if (user) {
			setUserLoggedIn(true);
		} else {
			setUserLoggedIn(false);
		}
	});

	useEffect(() => {
		const script = document.createElement('script');

		script.src = `https://maps.googleapis.com/maps/api/js?key=${google_places_api}&libraries=places`;
		script.async = true;

		document.body.appendChild(script);

		// return () => {
		// 	document.body.removeChild(script);
		// }
	}, []);

	if(userLoggedIn === null)
		return (<div className="centered spinner-border" role="status">
					<span className="sr-only">Loading...</span>
				</div>);

	return (
		<>
			<Router>
				<div className="App">
					<div className={'container'}>
						<Header userLoggedIn={userLoggedIn}/>
						<Switch>
							<Route path={'/other-events'}>
								<Events type="other-events" />
							</Route>
							<Route path={'/my-events'}>
								<Events type="my-events" />
							</Route>
							<Route path={'/create-event'}>
								<CreateEvent />
							</Route>
							<Route path={'/login'}>
								<Login />
							</Route>
							<Route path={'/signup'}>
								<Signup />
							</Route>
							<Route path={'/notifications'}>
								<Notifications></Notifications>
							</Route>
							<Route path={'/'}>
								<Infosection userLoggedIn={userLoggedIn}/>
							</Route>
						</Switch>
					</div>
				</div>
			</Router>
		</>
	);
}

export default App;
