import React from 'react';
import {BsCheckCircle} from "react-icons/all";


function RequestCollaboration({setToggleRequestModal, toggleRequestModal, setRequestedCollaboration, requestedCollaboration, eventInfo}) {
    return (
        <>
            {toggleRequestModal && (
                <div
                    id="myModal"
                    className={'modal'}
                    onClick={() => setToggleRequestModal(!toggleRequestModal)}
                >
                    <div className={'modal-content'} onClick={e => e.stopPropagation()}>
						<span
                            className={'close'}
                            onClick={() => setToggleRequestModal(!toggleRequestModal)}
                        >
							{' '}
                            &times;
						</span>
                        <h1>
                            {' '}
                            {`Become a collaborator in ${eventInfo.organizers[0].name}'s ${eventInfo.title}!`}{' '}
                        </h1>
                        <h4> Your message: </h4>
                        <input
                            className={'my-input'}
                            type={'text'}
                            placeholder={'Type in something...'}
                        />
                        <br />
                        <div className={'modal-bottom'}>
                            <button
                                className={'my-modal-button-submit'}
                                onClick={() => {
                                    setToggleRequestModal(!toggleRequestModal);
                                    setRequestedCollaboration(true);

                                    // TODO change the collaboration status!!
                                    // setEventInfo({
                                    //     ...eventInfo,
                                    //     collaboration_status: 'requested'
                                    // });
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