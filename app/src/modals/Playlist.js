import React, { useState } from 'react';
import { auth, db } from '../firebase';

function Playlist({
	setTogglePlaylistModal,
	togglePlaylistModal,
	eventInfo,
	setEventInfo
}) {
	const [showAdd, setShowAdd] = useState(false);
	const [song, setSong] = useState('');
	if (!togglePlaylistModal) return null;
	return !showAdd ? (
		<div
			id="myModal"
			className={'modal'}
			onClick={() => setTogglePlaylistModal(!togglePlaylistModal)}
		>
			<div className={'modal-content'} onClick={e => e.stopPropagation()}>
				<h1>{'Your playlist:'}</h1>
				{eventInfo.playlist.map(song => (
					<span>
						{song}{' '}
						<button
							onClick={() => {
								let newEventInfo = {
									...eventInfo,
									playlist: eventInfo.playlist.filter(play => play !== song)
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
					</span>
				))}
				<div className={'modal-bottom'}>
					<button
						className={'my-modal-button-submit'}
						onClick={() => {
							setShowAdd(true);
						}}
					>
						Add
					</button>
					<button
						className={'my-modal-button-cancel'}
						onClick={() => setTogglePlaylistModal(!togglePlaylistModal)}
					>
						{' '}
						CLOSE{' '}
					</button>
				</div>
			</div>
		</div>
	) : (
		<div id="myModal" className={'modal'} onClick={() => setShowAdd(!showAdd)}>
			<div className={'modal-content'} onClick={e => e.stopPropagation()}>
				<h1>{'Add song to your playlist'}</h1>
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
							if (song.length > 0 && !eventInfo.playlist.includes(song)) {
								let newEventInfo = {
									...eventInfo,
									playlist: [...eventInfo.playlist, song]
								};
								db.collection('events')
									.doc(eventInfo.id)
									.update({ playlist: newEventInfo.playlist })
									.then(() => {
										setEventInfo(newEventInfo);
										setShowAdd(false);
										setSong('');
									});
							}
						}}
					>
						{' '}
						SUBMIT{' '}
					</button>
					<button
						className={'my-modal-button-cancel'}
						onClick={() => {
							setShowAdd(false);
							setSong('');
						}}
					>
						{' '}
						CLOSE{' '}
					</button>
				</div>
			</div>
		</div>
	);
}

export default Playlist;
