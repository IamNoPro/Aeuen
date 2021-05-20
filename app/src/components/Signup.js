import React, { useState } from 'react';
import { auth } from '../firebase';

export const isValidEmail = email => {
	// referenced https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript
	var validRegex =
		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	return email.match(validRegex) !== null;
};

const Signup = () => {
	const [user, setUser] = useState({
		email: '',
		password: '',
		passwordConfirm: ''
	});

	const [errors, setErrors] = useState({
		email: '',
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
		if (!validInputs) {
			setErrors(currentErrors);
			return;
		}

		auth
			.createUserWithEmailAndPassword(user.email, user.password)
			.then(() => {
				window.location.replace('/my-events');
			})
			.catch(error => setErrors({ ...errors, message: error }));
	};

	return (
		<div className="content">
			<div className="left-content" />
			<div classname="mid-content container-create">
				<div className="container-create">
					<form className="create-event">
						<h1 align="center">Sign Up</h1>
						{errors.message && (
							<div style={{ color: 'red' }}>{errors.message}</div>
						)}
						<div className="form-control">
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

						<div className="form-control">
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

						<div className="form-control">
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

						<div style={{ marginLeft: '60px' }}>
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
		</div>
	);
};

export default Signup;
