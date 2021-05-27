import React from 'react';
import { auth, db } from '../firebase';
import {BiMinusCircle, BiPlusCircle, FcMusic} from "react-icons/all";

function SuggestedList({
	setToggleSuggestListModal,
	toggleSuggestListModal,
	eventInfo,
	setEventInfo
}) {
	if (!toggleSuggestListModal) return null;
	return (
		<div
			id="myModal"
			className={'modal'}
			onClick={() => setToggleSuggestListModal(!toggleSuggestListModal)}
		>
			<div className={'modal-content'} onClick={e => e.stopPropagation()}>
				<h1>{`Music suggestions:`}</h1>
				<div className={'song-list-container'}>
					{eventInfo.suggestions.map((suggestion, index) => (
						<div key={index} className={'song-item'}>
							<div className={'song-icon'}>
								<FcMusic size={40}/>
							</div>
							<div className={'song-text'}>
								{`${index + 1}. ${suggestion}`}
							</div>
							{!eventInfo.playlist.includes(suggestion) && (
								<div
									className={'song-delete'}
									onClick={() => {
										if (!eventInfo.playlist.includes(suggestion)) {
											let newEventInfo = {
												...eventInfo,
												playlist: [...eventInfo.playlist, suggestion]
											};
											db.collection('events')
												.doc(eventInfo.id)
												.update({ playlist: newEventInfo.playlist })
												.then(() => {
													setEventInfo(newEventInfo);
												});
										}
									}}
								>
									<BiPlusCircle size={40}/>
								</div>
							)}
							{eventInfo.playlist.includes(suggestion) && (
								<div
									className={'song-delete'}
									onClick={() => {
										let newEventInfo = {
											...eventInfo,
											playlist: eventInfo.playlist.filter(
												song => song !== suggestion
											)
										};

										db.collection('events')
											.doc(eventInfo.id)
											.update({ playlist: newEventInfo.playlist })
											.then(() => {
												setEventInfo(newEventInfo);
											});
									}}
								>
									<BiMinusCircle size={40}/>
								</div>
							)}
						</div>
					))}
				</div>
				<div className={'modal-bottom'}>
					<button
						className={'my-modal-button-cancel'}
						onClick={() => setToggleSuggestListModal(!toggleSuggestListModal)}
					>
						CLOSE
					</button>
				</div>
			</div>
		</div>
	);
}

export default SuggestedList;
