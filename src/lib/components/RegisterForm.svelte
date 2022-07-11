<script>
	import { lower_no_spaces, oe } from '$lib/utils/lodash';
	import { registerEndpoint } from '$lib/utils/constants';
	import { ccs } from '$lib/utils/countryCodes';
	import { post, browserSetJwt, browserSet } from '$lib/utils/requests';
	import { jwtStore, userStore } from '$lib/stores/index';

	let email = '';
	let username = 'dsfaccini';
	$: email = lower_no_spaces(email);
	$: username = lower_no_spaces(username);
	let company = 'DSF Apps.';
	let password = '';
	let password2 = '';
	let name = '';
	let region = '';
	let currency = 'eur';
	let errorMessage = '';
	/** @type {string | number} */
	let country_code;
	// @ts-ignore
	$: formValid = password === password2 && ccs[country_code];
	let show_password = false;

	/**
	 * Logs in user
	 * @param   {SubmitEvent}   event
	 */
	const register = async (event) => {
		errorMessage = !(password === password2)
			? 'Passwords have to match!'
			: // @ts-ignore
			!ccs[country_code]
			? 'Pick a country from the list'
			: '';
		if (errorMessage) {
			return;
		}
		const body = { username, email, password, currency, region, country_code, company };
		const { success, data, error } = await post(registerEndpoint, body);
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
			browserSet('user', user);
			userStore.set(user);
		}
	};
</script>

<form on:submit|preventDefault={register}>
	<h2>Register</h2>
	<label for="name">
		<input required type="text" id="name" placeholder="Name" bind:value={name} />
		<span>Name</span>
	</label>
	<label for="username">
		<input required type="text" id="username" placeholder="Username" bind:value={username} />
		<span>Username</span>
	</label>
	<label for="email">
		<input required type="text" id="email" placeholder="Email" bind:value={email} />
		<span>Email</span>
	</label>
	<label for="password">
		<!--<input type="checkbox" bind:checked={show_password}>-->
		<input required type="password" id="password" placeholder="Password" bind:value={password} />
		<span>Password</span>
	</label>
	<label for="password2">
		<input
			required
			type="password"
			id="password2"
			placeholder="Repeat Password"
			bind:value={password2}
		/>
		<span>Confirm Password</span>
	</label>
	<label for="company">
		<input required type="text" id="company" placeholder="Company" bind:value={company} />
		<span>Company</span>
	</label>
	<label for="currency">
		<select id="currency" bind:value={currency} required>
			<option value="eur" selected>Euro &euro;</option>
			<option value="gbp">Pount &pound;</option>
			<option value="usd">American Dollar $</option>
			<select />
		</select>
		<span>Preferred currency</span>
	</label>
	<label for="region">
		<select required id="region" bind:value={region} placeholder="Delivery Hub">
			<option value="eu">Europe</option>
			<option value="row">Rest of World</option>
			<select />
		</select>
		<span>Delivery hub</span>
	</label>
	<label for="country">
		<input
			required
			type="text"
			list="country_codes"
			id="country"
			placeholder="Country"
			bind:value={country_code}
		/>
		<span>Country</span>
	</label>
	<datalist id="country_codes">
		<option value="" />
		{#each oe(ccs) as code_country}
			<option value={code_country[0]}>{code_country[1]}</option>
		{/each}
	</datalist>
	<label for="submit-login">
		<input id="submit-login" type="submit" value="Register" />
	</label>
</form>
{#if errorMessage}
	<div class="error">
		{errorMessage}
	</div>
{/if}

<style>
	form {
		/*
		display: flex;
		flex-direction: column;
		*/
		padding: 0 25px;
	}
	select {
		min-width: 50%;
		min-height: 45px;
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
		/* translateY manages the position of the span in the input */
		transform: translateY(13px);
		font-size: 0.825em;
		transition-duration: 300ms;
		cursor: text;
		opacity: 80%;
	}
	label:focus-within > span,
	input:not(:placeholder-shown) + span,
	select:valid + span {
		color: var(--homeblue);
		transform: translateY(-25px) translateX(-20px);
		font-size: 0.9em;
		font-weight: 500;
		opacity: 100%;
	}
</style>
