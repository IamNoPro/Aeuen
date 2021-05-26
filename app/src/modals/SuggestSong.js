import React from 'react';
import {BsCheckCircle} from "react-icons/all";

function SuggestSong({setToggleSuggestModal, toggleSuggestModal, setSuggestedSong, suggestedSong}) {
    return (
        <>
            {
                toggleSuggestModal && (
                    <div
                        id="myModal"
                        className={'modal'}
                        onClick={() => setToggleSuggestModal(!toggleSuggestModal)}
                    >
                        <div className={'modal-content'} onClick={e => e.stopPropagation()}>
                            <h1> Suggest any song </h1>
                            <h4> Your suggestion: </h4>
                            <input
                                className={'my-input'}
                                type={'text'}
                                placeholder={'Type in the name of your song/songs'}
                            />
                            <br/>
                            <div className={'modal-bottom'}>
                                <button
                                    className={'my-modal-button-submit'}
                                    onClick={() => {
                                        setToggleSuggestModal(!toggleSuggestModal);
                                        setSuggestedSong(true);
                                    }}
                                >
                                    {' '}
                                    SUGGEST{' '}
                                </button>
                                <button
                                    className={'my-modal-button-cancel'}
                                    onClick={() => setToggleSuggestModal(!toggleSuggestModal)}
                                >
                                    {' '}
                                    CANCEL{' '}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                suggestedSong && (
                    <div className={'notification-box'}>
                        <BsCheckCircle size={100} />
                        <div className={'notification-text'}>
                            <h1> Success </h1>
                            <h3> Songs were successfully suggested! </h3>
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default SuggestSong;