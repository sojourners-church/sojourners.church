import { RESEND_SEGMENT_ID } from 'astro:env/server';
import type { Resend } from 'resend';

import type { SubscribeSchemaType } from './schema';

export const createSubscribeHandler =
	(resend: Resend) =>
	async ({ _gotcha, firstName, lastName, email }: SubscribeSchemaType) => {
		if (_gotcha) {
			return {
				message: 'Thank you! You have been subscribed.',
			};
		}

		const { error } = await resend.contacts.create({
			email,
			firstName,
			lastName,
			unsubscribed: false,
			segments: [{ id: RESEND_SEGMENT_ID }],
		});

		if (error) {
			console.log(error);
			return {
				ok: false,
				error,
				message: 'Error subscribing. Please try again.',
			};
		}

		return {
			ok: true,
			message: `Thanks for subscribing, ${firstName}!`,
		};
	};
