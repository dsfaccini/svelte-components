<script>
	import LoginForm from '$lib/components/LoginForm.svelte';
	import RegisterForm from '$lib/components/RegisterForm.svelte';

	let login = true;
</script>

<div class="blurr form-blur">
	<div class="active-bg" class:login-active={login} class:register-active={!login} />
	<div class="toggle-forms grid grid-cols-2">
		<div class:active={login} on:click={() => (login = true)}>Login</div>
		<div class:active={!login} on:click={() => (login = false)}>Register</div>
	</div>
	{#if login}
		<LoginForm />
	{:else}
		<RegisterForm />
	{/if}
</div>

<style>
	.register-active {
		transform: translate(100%, 0);
		border-radius: 0 30px 0 100px;
	}
	.login-active {
		border-radius: 30px 0 100px 0;
		left: 0;
	}
	.active-bg {
		position: absolute;
		background-color: var(--homeblue);
		opacity: 50%;
		top: 0;
		min-height: 50px;
		width: 50%;
		transition: all ease 900ms;
	}
	.toggle-forms * {
		min-height: 50px;
		text-align: center;
		border-radius: 100px;
		font-size: 20px;
		font-weight: 400;
		position: relative;
	}
	.form-blur {
		position: relative;
		min-height: 700px;
	}
	.toggle-forms {
		cursor: pointer;
	}
	.active {
		font-size: 22px;
		font-weight: 500;
		/* background-color: rgba(81, 255, 81, 0.497);*/
		color: white;
		transition: all ease-in 300ms;
	}
	.blurr {
		text-align: center;
		margin: 5px;
		padding: 5px 2px;
		background-color: rgba(255, 255, 255, 0.6);
		border-radius: 1em;
		height: fit-content;
	}
</style>
