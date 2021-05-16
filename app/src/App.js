import './App.css';
import Header from "./Header";
import OtherEvents from "./OtherEvents";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
// import 'antd/dist/antd.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

mapboxgl.accessToken = 'pk.eyJ1IjoicG9sbHV4eCIsImEiOiJja29qcWEybDQxZWlqMndvOXh5bGJkMXh4In0.-F11fMMGsYF9SMiEG-PP3w';

function App() {
  return (
    <Router>
        <div className="App">
            <div className={'container'}>
                <Header />
                <Switch>
                    <Route path={'/other-events'}>
                        <OtherEvents />
                    </Route>
                    <Route path={'/my-events'}>
                        My Events
                    </Route>
                    <Route path={'/'}>
                        Home
                    </Route>
                </Switch>
            </div>
        </div>
    </Router>
  );
}

export default App;
