import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import MyMap from "./Map";

const CreateEvent = (props) => {
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState('10:00');
    const [endTime, setEndTime] = useState('10:00');
    const [selectedFile, setSelectedFile] = useState(null);
	const [toggleCreateModal, setToggleCreateModal] = useState(false);

    const onStartTimeChange = (event) => {
        console.log('Star time = ', event.target.value);
        setStartTime(event.target.value);
    }

    const onEndTimeChange = (event) => {
        console.log('End time = ', event.target.value);
        setEndTime(event.target.value);
    }

    const onChangeFile = (event) => {
        console.log('selected file', event.target.name);
        setSelectedFile(event.target.value);
    }

    return (
        <div className='content'>
            <div className='left-content'/>
            <div classname='mid-content container-create'>
                <div className='container-create'>
                    <form className='create-event'>
                        <h1 align='center'>Create a new event</h1>
                        <div className='form-control'>
                            <label>Title</label>
                            <input 
                                type='text' 
                                placeholder='Add Title'
                                value={title}
                                onChange={ (event) => {
                                    setTitle(event.target.value);
                                } }
                            />

                        </div>
                        
                        <div className='form-control'>
                            <label>
                                Poster
                            </label>
                            <label className='form-control-poster' style={{width: selectedFile ? '400px' : '150px'}}>
                                { selectedFile ? selectedFile : 'Upload Picture'} <i className="fa fa-upload"></i> 
                                <input 
                                    id="upload" 
                                    type="file"
                                    accept="image/*"
                                    value={selectedFile}
                                    onChange={onChangeFile}
                                />
                            </label>
                        </div>

                        <div className='form-control form-control-description'>
                            <label>Description</label>
                            <textarea 
                                placeholder='Add Description'
                                value={description}
                                onChange={ (event) => {
                                    setDescription(event.target.value);
                                } }
                            />
                        </div>

                        <div className='form-control'>
                            <label>Date</label>
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                            />
                        </div>

                        <div className='form-control form-control-time'>
                            <label>Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={onStartTimeChange}
                            />
                        </div>
                        
                        <div className='form-control form-control-time'>
                            <label>End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={onEndTimeChange}
                            />
                        </div>
                        
                        <div className='form-control'>
                            <label>Location</label>
                            <MyMap />
                        </div>
                        
                        <div style={{marginLeft: '150px'}}>
                            <button 
                                type='button' 
                                value='Create Event' 
                                className='my-button' 
                                onClick={() => {
                                    console.log('create event button');
                                    setToggleCreateModal(!toggleCreateModal);
                                }}
                            >
                                <div>Create Event</div>
                            </button>
                        </div>
                    </form>
                    </div>
                </div>
            <div classname='right-content' style={{ marginTop: '100px' }}>
                { selectedFile ? <img className='poster' src='https://i.imgur.com/RK76Ejg.jpeg' width={300}></img> : null }
            </div>
        </div>
    )
}

export default CreateEvent;