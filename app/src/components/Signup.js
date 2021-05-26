import React, { useState } from 'react';
import { auth } from '../firebase';
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import { storage } from '../firebase'

export const isValidEmail = email => {
	// referenced https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript
	var validRegex =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	return email.match(validRegex) !== null;
};

const Signup = () => {
	let history = useHistory();
    let users = firebase.firestore().collection('users');

	const [user, setUser] = useState({
		email: '',
		name: '',
		password: '',
		passwordConfirm: ''
	});

	const [errors, setErrors] = useState({
		email: '',
		name: '',
		password: '',
		passwordConfirm: '',
		message: ''
	});

	const [selectedFile, setSelectedFile] = useState({
        name: null,
        file: null
    });

	const onChange = event => {
		let input = event.target.value;
		let property = event.target.name;
		setUser({ ...user, [property]: input });
		setErrors({ ...errors, [property]: '', message: '' });
	};


    const addFirestore = (uid) => {
        if (!selectedFile.raw_file) return;
		
		// console.log(selectedFile.file);

        const uploadTask = storage.ref(`profile_images/${selectedFile.name}`).put(selectedFile.raw_file);
        uploadTask.on(
          "state_changed",
          snapshot => {
          },
          error => {
            console.log(error)
          },
          () => {
            storage
              .ref("profile_images")
              .child(selectedFile.name)
              .getDownloadURL()
              .then(url => {
                console.log(url)
                console.log('user uid: ' + uid)
				
				users.doc(uid).set({
					'name': user.name,
					'events': [],
					'picture': url,
				})

              })
          }
        )
		}

	const onSubmit = () => {
		let validInputs = true;
		let currentErrors = {
			email: '',
			password: '',
			passwordConfirm: ''
		};
		if (!isValidEmail(user.email)) {
			currentErrors.email = 'Please input valid email';
			validInputs = false;
		}
		if (user.password.length < 6) {
			currentErrors.password = 'Password must contain at least 6 character';
			validInputs = false;
		}
		if (user.password !== user.passwordConfirm) {
			currentErrors.passwordConfirm = 'Passwords must be the same';
			validInputs = false;
		}
		if (user.name.length === 0) {
			currentErrors.name = 'Full Name cannot be empty';
			validInputs = false;
		}
		if (!validInputs) {
			setErrors(currentErrors);
			return;
		}

		auth
			.createUserWithEmailAndPassword(user.email, user.password)
			.then(function(data) {
				console.log(data.user.uid);
				
				addFirestore(data.user.uid);

				users.doc(data.user.uid).set({
					'name': user.name,
					'events': []
				})

				history.push({pathname: "/my-events", state: {user_uid: data.user.uid}});
			})
			.catch(error => setErrors({ ...errors, message: error }));
	};

	const onChangeFile = (event) => {
        console.log('selected file', event.target.files[0]);
        setSelectedFile({
                        name: event.target.files[0].name,
                        file: URL.createObjectURL(event.target.files[0]),
						raw_file: event.target.files[0]
                    });
    }

	return (
		<div className="content">
			<div className="left-content" />
				<div className="mid-content container-create">
					<form className="create-event">
						<div className="form-control form-control-login" >
							<h1 align="center">Sign Up</h1>
							{errors.message && (
								<div style={{ color: 'red' }}>{errors.message}</div>
							)}
						</div>
						
						<div className="form-control form-control-login" >
							<label>Email</label>
							<input
								name="email"
								type="text"
								placeholder="email@example.com"
								value={user.email}
								onChange={onChange}
							/>
							{errors.email && (
								<div style={{ color: 'red' }}>{errors.email}</div>
							)}
						</div>

						<div className="form-control form-control-login">
							<label>Full Name</label>
							<input
								name="name"
								type="text"
								placeholder="Elon Musk"
								value={user.name}
								onChange={onChange}
							/>
							{errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
						</div>

						<div className="form-control form-control-login">
							<label>Password</label>
							<input
								name="password"
								type="password"
								placeholder="Enter password"
								value={user.password}
								onChange={onChange}
							/>
							{errors.password && (
								<div style={{ color: 'red' }}>{errors.password}</div>
							)}
						</div>

						<div className="form-control form-control-login">
							<label>Confirm Password</label>
							<input
								name="passwordConfirm"
								type="password"
								placeholder="Confirm password"
								value={user.passwordConfirm}
								onChange={onChange}
							/>
							{errors.passwordConfirm && (
								<div style={{ color: 'red' }}>{errors.passwordConfirm}</div>
							)}
						</div>

						<div className='form-control form-control-login'>
                            <label>
                                Profile Picture
                            </label>
                            <label className='form-control-poster' style={{width: selectedFile.file ? '275px' : '150px'}}>
                                { selectedFile.file ? selectedFile.name : 'Upload Picture'} <i className="fa fa-upload"></i> 
                                <input 
                                    id="upload" 
                                    type="file"
                                    accept="image/*"
                                    onChange={onChangeFile}
                                />
                            </label>
                        </div>

						<div style={{ marginLeft: '180px' }}>
							<button
								type="button"
								value="Sign Up"
								className="my-button"
								onClick={onSubmit}
							>
								<div>Sign Up</div>
							</button>
						</div>
					</form>
				</div>
				<div className='right-content' style={{ marginTop: '100px', marginLeft: '50px' }}>
                	{ selectedFile.file ? <img className='poster' src={selectedFile.file} width={300}></img> : null }
            	</div>
			</div>
	);
};

export default Signup;
