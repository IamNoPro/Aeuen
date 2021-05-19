import React from 'react';

const Signup = () => {
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
			<div>
				<span>Confirm Password</span>
				<br />
				<input required placeholder="confirm your password"></input>
			</div>
			<button type="button" class="btn btn-primary">
				Sign up
			</button>
		</div>
	);
};

export default Signup;
