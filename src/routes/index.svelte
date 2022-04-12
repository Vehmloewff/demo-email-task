<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let inputEl: HTMLInputElement;
	let loading = false;
	let email = '';
	$: emailIsValid = /.+@.+\..+/.test(email);

	interface Notice {
		error?: boolean;
		text: string;
	}

	let notice: Notice | null = null;

	onMount(() => inputEl.focus());

	async function submit() {
		if (!emailIsValid) return;

		loading = true;

		try {
			await fetch('/email', { method: 'POST', body: JSON.stringify({ email }) }).then(
				async (res) => {
					if (!res.ok) throw new Error(await res.text());
				}
			);

			showNotice({ text: "🎉 Check your inbox!  (Don't forget the spam folder :D)" });
		} catch (e) {
			showNotice({ error: true, text: `🚫 ${e.message}` });
		}

		loading = false;
	}

	let timeout: any;
	function showNotice(noticeToShow: Notice) {
		notice = noticeToShow;

		clearTimeout(timeout);
		timeout = setTimeout(() => (notice = null), 5000);
	}
</script>

<svelte:head>
	<title>Hello World Emailer</title>
</svelte:head>

<div class="app">
	<div>
		<form on:submit|preventDefault={submit}>
			<h3>Would you like to get a "Hello World"?</h3>
			<p>Enter your email below</p>

			<label>
				<div class="spacer" />

				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mail-icon"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
					<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
				</svg>

				<div class="spacer" />

				<input type="email" bind:this={inputEl} bind:value={email} />

				<div class="spacer" />

				<button disabled={loading || !emailIsValid}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="send-icon"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>

				<div class="spacer" />
			</label>
		</form>
	</div>

	<div class="background" />
	<div class="background-damper" />

	{#if notice}
		<div class="notice" class:error={notice.error} in:fly={{ y: 40 }}>{notice.text}</div>
	{/if}
</div>

<style>
	.app {
		--primary: #0095b6;

		height: 100vh;

		display: flex;
		flex-direction: column;

		align-items: stretch;
		justify-content: center;
		position: relative;

		color: #fff;
		overflow: hidden;
	}

	.background {
		background-image: url('/small-background.jpeg');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;

		filter: blur(1.5rem);
		-webkit-filter: blur(1.5rem);

		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: -1;
	}

	.background-damper {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: -1;

		background: rgba(0, 0, 0, 0.4);
	}

	form {
		margin: auto;
		max-width: 600px;
		text-align: center;
	}

	p {
		opacity: 0.6;
		padding-bottom: 2rem;
	}

	label {
		display: flex;
		align-items: center;

		border: 0.2rem solid rgba(255, 255, 255, 0.2);
		border-radius: 1rem;
		cursor: text;
	}
	label:focus-within {
		border: 0.2rem solid var(--primary);
	}

	.mail-icon {
		width: 3rem;
		height: 3rem;
		color: #aaa;
	}
	input {
		flex-grow: 1;
		border: none;
		font-size: 1.6rem;
		padding: 2rem 0rem;
		outline: none;
		font-family: 'Readex Pro', sans-serif;
		background: rgba(0, 0, 0, 0);
		color: #fff;
	}
	button {
		padding: 0.5rem 1rem;
		margin: 0;

		cursor: pointer;
		border: none;
		border-radius: 0.5rem;
		background: var(--primary);
		color: #fff;
	}
	button:disabled {
		opacity: 0.5;
		filter: grayscale(1);
	}
	.send-icon {
		width: 2.5rem;
		height: 2.5rem;
	}

	.spacer {
		width: 1rem;
	}
	svg {
		float: left; /* fixes extra space on screen caused by whitespace in inline elements */
		pointer-events: none;
	}

	.notice {
		position: absolute;
		bottom: 2rem;
		width: 40rem;
		left: calc(50vw - 20rem);

		background: rgba(138, 199, 127, 0.8);
		border-radius: 0.5rem;
		padding: 1.5rem;
		color: #444;
	}
	.notice.error {
		background: rgba(222, 132, 140, 0.8);
	}
</style>
