import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSubscribeHandler } from '#/actions/subscribe';

vi.mock('astro:env/server', () => ({
	RESEND_SEGMENT_ID: 'segment-123',
}));

describe('createSubscribeHandler', () => {
	const create = vi.fn();

	const resend = {
		contacts: {
			create,
		},
	} as never;

	const handler = createSubscribeHandler(resend);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns success without calling Resend when honeypot is filled', async () => {
		const result = await handler({
			firstName: 'John',
			lastName: 'Doe',
			email: 'john@example.com',
			_gotcha: 'spam',
		});

		expect(create).not.toHaveBeenCalled();

		expect(result).toEqual({
			message: 'Thank you! You have been subscribed.',
		});
	});

	it('creates the contact and returns success', async () => {
		create.mockResolvedValue({
			error: null,
		});

		const result = await handler({
			firstName: 'John',
			lastName: 'Doe',
			email: 'john@example.com',
		});

		expect(create).toHaveBeenCalledOnce();

		expect(create).toHaveBeenCalledWith({
			email: 'john@example.com',
			firstName: 'John',
			lastName: 'Doe',
			unsubscribed: false,
			segments: [{ id: 'segment-123' }],
		});

		expect(result).toEqual({
			ok: true,
			message: 'Thanks for subscribing, John!',
		});
	});

	it('returns an error when Resend returns one', async () => {
		const error = {
			message: 'Already subscribed',
		};

		create.mockResolvedValue({ error });

		const result = await handler({
			firstName: 'John',
			lastName: 'Doe',
			email: 'john@example.com',
		});

		expect(result).toEqual({
			ok: false,
			error,
			message: 'Error subscribing. Please try again.',
		});
	});

	it('propagates exceptions from Resend', async () => {
		create.mockRejectedValue(new Error('Network error'));

		await expect(
			handler({
				firstName: 'John',
				lastName: 'Doe',
				email: 'john@example.com',
			}),
		).rejects.toThrow('Network error');
	});
});
