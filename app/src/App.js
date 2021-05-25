import Header from './components/Header';
import Events from './components/Events';
import Infosection from './components/InfoSection';
import CreateEvent from './components/CreateEvent';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Login from './components/Login';
import Signup from './components/Signup';
import './css/App.css';
// import 'antd/dist/antd.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

mapboxgl.accessToken =
	'pk.eyJ1IjoicG9sbHV4eCIsImEiOiJja29qcWEybDQxZWlqMndvOXh5bGJkMXh4In0.-F11fMMGsYF9SMiEG-PP3w';

function App() {
	return (
		<Router>
			<div className="App">
				<div className={'container'}>
					<Header />
					<Switch>
						<Route path={'/other-events'}>
							<Events type="other-events" />
						</Route>
						<Route path={'/my-events'}>
							<Events type="my-events" />
						</Route>
						<Route path={'/create-event'}>
							{console.log('as creating event')}
							<CreateEvent />
						</Route>
						<Route path={'/login'}>
							<Login />
						</Route>
						<Route path={'/signup'}>
							<Signup />
						</Route>
						<Route path={'/'}>
							<Infosection />
						</Route>
					</Switch>
				</div>
			</div>
		</Router>
	);
}

export default App;
