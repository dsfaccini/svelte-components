<script>
	import { lower_no_spaces } from '$lib/utils/lodash';
	import { post, browserSetJwt } from '$lib/utils/requests';
	import { jwtStore } from '$lib/stores/index';

	let emailPlaceholder = 'Email or username';
	let identifier = 'dasfacc';
	$: identifier = lower_no_spaces(identifier);
	/** @type {string}*/
	let password;
	let errorMessage = '';
	$: formValid = identifier && password;

	/**
	 * Logs in user
	 * @param   {SubmitEvent}   event
	 */
	const login = async (event) => {
		errorMessage = '';
		const body = { identifier, password };
		const { success, data, error } = await post('/api/auth/local', body);
		console.log({ success, data, error });
		if (!success) {
			// @ts-ignore
			let { details, status, message, name } = error;
			errorMessage = message;
		} else {
			// @ts-ignore
			const { jwt: jwtValue, user } = data;
			browserSetJwt(jwtValue);
			jwtStore.set(jwtValue);
			/*
			 * By setting the store we can trigger reactions in other components
			 * alternatively we can import svelte's event dispatcher and dispatch the login event
			 */
		}
	};
</script>

<form on:submit|preventDefault={login}>
	<h2>Log In</h2>
	<label for="email">
		<input required type="text" id="email" placeholder={emailPlaceholder} bind:value={identifier} />
		<span>{emailPlaceholder}</span>
	</label>
	<label for="password">
		<input required type="password" id="password" placeholder="Password" bind:value={password} />
		<span>Password</span>
	</label>
	<label for="submit-login">
		<input id="submit-login" type="submit" value="Login" />
	</label>
</form>
{#if errorMessage}
	<div class="error">
		{errorMessage}
	</div>
{/if}

<style>
	form {
		padding: 0 25px;
	}
	.error {
		padding: 10px 20px;
		background-color: rgba(255, 0, 0, 0.5);
	}
	.error:hover {
		opacity: 100%;
		background-color: rgba(255, 0, 0, 1);
	}
	h2 {
		font-size: 2em;
		margin-bottom: var(--formelementgap);
	}
	input[type='submit'] {
		background-color: rgba(255, 255, 255, 0.276);
		color: var(--homeblue);
		border: 1px solid var(--homeblue);
		margin: 0 0;
		cursor: pointer;
		transition: all ease 200ms;
	}
	input[type='submit']:hover {
		background-color: var(--homeblue);
		opacity: 70%;
		color: white;
	}
	input[type='submit']:disabled {
		background-color: grey;
		opacity: 50%;
		cursor: not-allowed;
	}
	* {
		border-radius: 0.5em;
	}
	label {
		margin-bottom: var(--formelementgap);
		position: relative;
		display: flex;
		flex-direction: column;
	}
	input {
		padding: 10px 5px;
		border: none;
		outline: none;
	}
	input::placeholder {
		opacity: 0;
	}
	span {
		position: absolute;
		top: 0;
		left: 10px;
		transform: translateY(13px);
		font-size: 0.825em;
		transition-duration: 300ms;
		cursor: text;
		opacity: 80%;
	}
	label:focus-within > span,
	input:not(:placeholder-shown) + span {
		color: var(--homeblue);
		transform: translateY(-25px) translateX(-20px);
		font-size: 0.9em;
		font-weight: 500;
		opacity: 100%;
	}
</style>
