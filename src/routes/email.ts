import type { RequestEvent } from '@sveltejs/kit/types/private';

const REVIEWER_EMAIL = process.env.REVIEWER_EMAIL;
const REVIEWER_NAME = process.env.REVIEWER_NAME;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

const reviewerEmail = `

Hey ${REVIEWER_NAME}!

Thank you for checking out the demo site!  I hope you like it!

Cheers,

Elijah Mooring

`;

const standardEmail = `

Hello, hello, hello, World!

`;

export async function post({ request }: RequestEvent) {
	const { email } = await request.json();

	if (!email) return { status: 400, body: 'Expected an "email" field in request body' };

	console.log('Sending an email to', email);

	const error = await fetch('https://api.sendgrid.com/v3/mail/send', {
		method: 'POST',
		headers: { Authorization: `Bearer ${SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			personalizations: [{ to: [{ email }] }],
			from: { email: 'emooring@pm.me', name: 'Elijah Mooring' },
			subject: 'Hello World!',
			content: [
				{ type: 'text/plain', value: email === REVIEWER_EMAIL ? reviewerEmail : standardEmail }
			]
		})
	})
		.then(async (res) => {
			if (res.ok) return;

			const json = await res.json();
			console.log(json);
			if (json.errors) return json.errors[0].message;

			return json;
		})
		.catch((error) => error.message);

	if (error) return { status: 500, body: error };

	return { body: 'ok' };
}
