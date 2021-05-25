import React, { useState } from 'react';
import { auth } from '../firebase';
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";

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

	const onChange = event => {
		let input = event.target.value;
		let property = event.target.name;
		setUser({ ...user, [property]: input });
		setErrors({ ...errors, [property]: '', message: '' });
	};

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
				
				users.doc(data.user.uid).set({
					'name': 'Alesha Popovich',
					'events': []
				})
				
				history.push("/my-events");
			})
			.catch(error => setErrors({ ...errors, message: error }));
	};

	return (
		<div className="content">
			<div className="left-content" />
				<div classname="mid-content">
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
			</div>
	);
};

export default Signup;
