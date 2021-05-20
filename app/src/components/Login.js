import React, { useState } from 'react';
import { auth } from '../firebase';
import { isValidEmail } from './Signup';

const Login = () => {
	const [user, setUser] = useState({
		email: '',
		password: ''
	});

	const [errors, setErrors] = useState({
		email: '',
		password: '',
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
		if (!validInputs) {
			setErrors(currentErrors);
			return;
		}

		auth
			.signInWithEmailAndPassword(user.email, user.password)
			.then(() => {
				window.location.replace('/my-events');
			})
			.catch(() =>
				setErrors({ ...errors, message: 'Email or password is incorrect' })
			);
	};

	return (
		<div className="content">
			<div className="left-content" />
			<div classname="mid-content container-create">
				<div className="container-create">
					<form className="create-event">
						<h1 align="center">Log In</h1>
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

						<div style={{ marginLeft: '60px' }}>
							<button
								type="button"
								value="Sign Up"
								className="my-button"
								onClick={onSubmit}
							>
								<div>Log In</div>
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
