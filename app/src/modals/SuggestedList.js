import React from 'react';
import { auth, db } from '../firebase';

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
				{eventInfo.suggestions.map(suggestion => (
					<span>
						{suggestion}{' '}
						{!eventInfo.playlist.includes(suggestion) && (
							<button
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
								Add
							</button>
						)}
						{eventInfo.playlist.includes(suggestion) && (
							<button
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
								Remove
							</button>
						)}
					</span>
				))}
			</div>
		</div>
	);
}

export default SuggestedList;
