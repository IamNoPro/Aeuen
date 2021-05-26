import React from 'react';
import {auth, db} from "../firebase";

function RequestsList({setToggleRequestModal, toggleRequestModal}) {
    if(!toggleRequestModal)
        return null;
    return (
        <div
            id="myModal"
            className={'modal'}
            onClick={() => setToggleRequestModal(!toggleRequestModal)}
        >
            <div className={'modal-content'} onClick={e => e.stopPropagation()}>
                <h1>
                    {`Collaboration requests:`}
                </h1>

            </div>
        </div>
    );
}

export default RequestsList;