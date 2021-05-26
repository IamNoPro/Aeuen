import React, { useState } from 'react';
import { BsCheckCircle } from 'react-icons/all';
import { db } from '../firebase';

function SuggestSong({
	setToggleSuggestModal,
	toggleSuggestModal,
	setSuggestedSong,
	suggestedSong,
	eventInfo,
	setEventInfo
}) {
	const [song, setSong] = useState('');
	return (
		<>
			{toggleSuggestModal && (
				<div
					id="myModal"
					className={'modal'}
					onClick={() => setToggleSuggestModal(!toggleSuggestModal)}
				>
					<div className={'modal-content'} onClick={e => e.stopPropagation()}>
						<span
							className={'close'}
							onClick={() => setToggleSuggestModal(!toggleSuggestModal)}
						>
							{' '}
							&times;
						</span>
						<h1> Suggest any song </h1>
						<h4> Your suggestion: </h4>
						<input
							className={'my-input'}
							type={'text'}
							placeholder={'Type in the name of your song/songs'}
							value={song}
							onChange={event => setSong(event.target.value)}
						/>
						<br />
						<div className={'modal-bottom'}>
							<button
								className={'my-modal-button-submit'}
								onClick={() => {
									if (song.length > 0) {
										let newEventInfo = {
											...eventInfo,
											suggestions: [...eventInfo.suggestions, song]
										};
										db.collection('events')
											.doc(eventInfo.id)
											.update({ suggestions: newEventInfo.suggestions })
											.then(() => {
												setEventInfo(newEventInfo);
												setToggleSuggestModal(!toggleSuggestModal);
												setSuggestedSong(true);
											});
									}
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
			)}
			{suggestedSong && (
				<div className={'notification-box'}>
					<BsCheckCircle size={100} />
					<div className={'notification-text'}>
						<h1> Success </h1>
						<h3> Songs were successfully suggested! </h3>
					</div>
				</div>
			)}
		</>
	);
}

export default SuggestSong;
