import React from 'react';

const Login = () => {
	return (
		<div>
			<span>Welcome to Aeuen</span>
			<div>
				<span>Email</span>
				<br />
				<input required placeholder="email@example.com"></input>
			</div>
			<div>
				<span>Password</span>
				<br />
				<input required placeholder="enter your password"></input>
			</div>
			<button type="button" class="btn btn-primary">
				Log In
			</button>
		</div>
	);
};

export default Login;
