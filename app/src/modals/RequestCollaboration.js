import React, {useState} from 'react';
import {BsCheckCircle} from "react-icons/all";
import { auth, db } from '../firebase';


function RequestCollaboration({setToggleRequestModal, toggleRequestModal, setRequestedCollaboration, requestedCollaboration, eventInfo, setEventInfo}) {
    const [message, setMessage] = useState('');

    return (
        <>
            {toggleRequestModal && (
                <div
                    id="myModal"
                    className={'modal'}
                    onClick={() => setToggleRequestModal(!toggleRequestModal)}
                >
                    <div className={'modal-content'} onClick={e => e.stopPropagation()}>
                        <h1>
                            {' '}
                            {`Become a collaborator in ${eventInfo.organizers[0].name}'s ${eventInfo.title}!`}{' '}
                        </h1>
                        <h4> Your message: </h4>
                        <input
                            className={'my-input'}
                            type={'text'}
                            placeholder={'Type in something...'}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <br />
                        <div className={'modal-bottom'}>
                            <button
                                className={'my-modal-button-submit'}
                                onClick={() => {
                                    setToggleRequestModal(!toggleRequestModal);
                                    setRequestedCollaboration(true);

                                    // TODO change the collaboration status!!
                                    let collab_requests = [...eventInfo.collab_requests];
                                    collab_requests.push({
                                        user_id: auth.currentUser.uid,
                                        status: 'pending',
                                        message: message
                                    });
                                    setEventInfo({
                                        ...eventInfo,
                                        collab_requests: collab_requests
                                    });
                                    db.collection('events').doc(eventInfo.id).update({
                                       collab_requests: collab_requests
                                    }).then(() => {
                                        console.log("Document successfully updated!");
                                    }).catch((error) => {
                                        console.log(error);
                                    });
                                }}
                            >
                                {' '}
                                REQUEST{' '}
                            </button>
                            <button
                                className={'my-modal-button-cancel'}
                                onClick={() => setToggleRequestModal(!toggleRequestModal)}
                            >
                                {' '}
                                CANCEL{' '}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {requestedCollaboration && (
                <div className={'notification-box'}>
                    <BsCheckCircle size={100} />
                    <div className={'notification-text'}>
                        <h1> Success </h1>
                        <h3> Request was successfully sent! </h3>
                    </div>
                </div>
            )}
        </>
    );
}

export default RequestCollaboration;