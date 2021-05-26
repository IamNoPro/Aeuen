import React, { useState } from 'react';
import { auth } from '../firebase';
import { isValidEmail } from './Signup';
import {useHistory} from "react-router-dom";

const Login = () => {
	let history = useHistory();

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
		console.log('on submit!');
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
			.then((data) => {
				console.log('lolkek?');
				console.log(data.user);
				// history.push('/my-events');
				// history.push("/my-events", {user: data.user});
				history.push({pathname: "/my-events", state: {user_uid: data.user.uid}});
			})
			.catch((error) => {
					console.log(error);
					setErrors({ ...errors, message: 'Email or password is incorrect' })
				}
			);
	};

	return (
		<div className="content">
			<div className="left-content" />
				<div className="mid-content">
					<form className="create-event">
						<div className="form-control form-control-login" >
							<h1 align="center">Log In</h1>
							{errors.message && (
								<div style={{ color: 'red' }}>{errors.message}</div>
							)}
						</div>

						<div className="form-control form-control-login">
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

						<div style={{ marginLeft: '180px' }}>
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
				<div className="right-content"/>
			</div>
	);
};

export default Login;
