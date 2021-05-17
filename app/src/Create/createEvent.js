import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import MyMap from "./Map";

const Create = (props) => {
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState('10:00');
    const [endTime, setEndTime] = useState('10:00');

    const onStartTimeChange = (event) => {
        console.log('Star time = ', event.target.value);
        setStartTime(event.target.value);
    }

    const onEndTimeChange = (event) => {
        console.log('End time = ', event.target.value);
        setEndTime(event.target.value);
    }


    return (
        <form className='create-event'>
            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBP3jA4HUEUNG-G40Udp2NwkzZ5JARM8XU&libraries=places"></script>

            <h1 align='center'>Create a new event</h1>
            <div className='form-control'>
                <label>Title</label>
                <input type='text' placeholder='Add Title'/>

            </div>
            
            <p>Poster</p>
            <div className='form-control form-control-poster'>
                <label>
                    Upload Picture <i className="fa fa-upload"></i> 
                    <input id="file-upload" type="file"/>
                </label>
            </div>

            <div className='form-control form-control-description'>
                <label>Description</label>
                <textarea placeholder='Add Description'/>
            </div>

            <div className='form-control'>
                <label>Date</label>
                <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                />
            </div>

            <div className='form-control form-control-time'>
                <label>Time Range</label>
                <input
                    type="time"
                    value={startTime}
                    onChange={onStartTimeChange}
                />
                <input
                    type="time"
                    value={endTime}
                    onChange={onEndTimeChange}
                />
            </div>
            
            <MyMap />

            <input type='submit' value='Create Event' className='btn btn-block'/>
        </form>
    )
}

export default Create;