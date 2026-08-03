import { defineAction } from 'astro:actions';
import { RESEND_API_KEY } from 'astro:env/server';
import { Resend } from 'resend';

import { SubscribeSchema } from './schema';
import { createSubscribeHandler } from './subscribe';

const resend = new Resend(RESEND_API_KEY);

export const server = {
	subscribeClient: defineAction({
		accept: 'form',
		input: SubscribeSchema,
		handler: createSubscribeHandler(resend),
	}),
};
