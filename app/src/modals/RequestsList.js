import React, {useEffect, useState} from 'react';
import {auth, db} from "../firebase";
import '../css/RequestsList.css';


function RequestsList({setToggleRequestModal, toggleRequestModal, eventInfo, setEventInfo}) {
    let [collabRequests, setCollabRequests] = useState(null);

    useEffect(async () => {
        if(collabRequests)
            return;
        let tmp = await Promise.all(eventInfo.collab_requests.map(async (collab) => {
            let collab_copy = {...collab};
            let userSnapshot = await db.collection('users').doc(collab.user_id).get();
            collab_copy.user = userSnapshot.data();
            return collab_copy;
        }));
        setCollabRequests(tmp);
    }, [collabRequests]);

    const processCollab = async (collab, index, status) => {
        let new_collab_requests = [...eventInfo.collab_requests];
        new_collab_requests[index] = {
            ...new_collab_requests[index],
            status: status
        }
        let new_organizers = eventInfo.organizers.map((organizer) => organizer.uid);
        if(status === 'accepted' && !new_organizers.includes(collab.user_id))
            new_organizers.push(collab.user_id);
        if((status === 'rejected' || status === 'pending') && new_organizers.includes(collab.user_id))
            new_organizers.splice(new_organizers.indexOf(collab.user_id), 1);

        let new_organizers_profile = await Promise.all(
            new_organizers.map(async organizer => {
                let userSnapshot = await db
                    .collection('users')
                    .doc(organizer)
                    .get();
                return {
                    ...userSnapshot.data(),
                    uid: organizer
                };
            })
        );

        console.log(new_collab_requests);
        console.log(new_organizers);

        let msg = await db.collection('events').doc(eventInfo.id).update({
            collab_requests: new_collab_requests,
            organizers: new_organizers
        });

        setEventInfo({
            ...eventInfo,
            collab_requests: new_collab_requests,
            organizers: new_organizers_profile
        });

        let new_cur_collab_requests = [...collabRequests];
        new_cur_collab_requests[index] = {
            ...new_cur_collab_requests[index],
            status: status
        }
        setCollabRequests(new_cur_collab_requests);
    }

    if(!toggleRequestModal)
        return null;
    if(!collabRequests)
        return null;

    return (
        <div
            id="myModal"
            className={'modal'}
            onClick={() => {
                setCollabRequests(null);
                setToggleRequestModal(!toggleRequestModal);
            }}
        >
            <div className={'modal-content'} onClick={e => e.stopPropagation()}>
                <h1>
                    {`Collaboration requests:`}
                </h1>
                <div className={'collab-requests-container'}>
                    {
                        collabRequests.map((collab, index) => {
                            return (
                                <div key={index} className={'collab-request-container'}>
                                    <img className={'collab-avatar'} src={collab.user.picture ? collab.user.picture : 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png'}/>
                                    <div className={'collab-text-container'}>
                                        <div className={'collab-text-header'}>
                                            <span className={'collab-user-name'}> {collab.user.name} </span>
                                            <span className={`collab-status collab-${collab.status}`}> { collab.status } </span>
                                        </div>
                                        <span className={'collab-user-message'}> {collab.message} </span>
                                    </div>
                                    <div className={'collab-buttons-container'}>

                                        {
                                            collab.status !== 'pending'
                                                ? (
                                                    <button type="button" className="btn btn-outline-secondary" onClick={() => processCollab(collab, index, 'pending')}>
                                                        cancel
                                                    </button>
                                                )
                                                : (
                                                    <>
                                                        <button type="button" className="btn btn-outline-success" style={{marginBottom: 5}} onClick={() => processCollab(collab, index, 'accepted')}>
                                                            accept
                                                        </button>
                                                        <button type="button" className="btn btn-outline-danger" onClick={() => processCollab(collab, index, 'rejected')}>
                                                            reject
                                                        </button>
                                                    </>
                                                )
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={'modal-bottom'}>
                    <button
                        className={'my-modal-button-cancel'}
                        onClick={() => {
                            setCollabRequests(null);
                            setToggleRequestModal(!toggleRequestModal);
                        }}
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RequestsList;