import { beforeEach, describe, expect, it, vi } from 'vitest';

import { preflight } from '#/components/calendar/preflight';

vi.mock('astro:env/client', () => ({
	PUBLIC_GOOGLE_CALENDAR_API_KEY: 'test-api-key',
	PUBLIC_GOOGLE_CALENDAR_ID: 'test-calendar-id',
}));

describe('preflight', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('calls the Google Calendar API with the correct URL', async () => {
		const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: true,
		} as Response);

		await preflight();

		expect(fetchSpy).toHaveBeenCalledOnce();
		expect(fetchSpy).toHaveBeenCalledWith(
			'https://www.googleapis.com/calendar/v3/calendars/test-calendar-id/events?key=test-api-key',
		);
	});

	it('returns ok when the request succeeds', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: true,
		} as Response);

		await expect(preflight()).resolves.toEqual({
			ok: true,
		});
	});

	it('returns the Google API error when the request fails', async () => {
		const error = {
			code: 403,
			message: 'API key not valid.',
		};

		vi.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: false,
			json: vi.fn().mockResolvedValue({
				error,
			}),
		} as unknown as Response);

		await expect(preflight()).resolves.toEqual({
			ok: false,
			error,
		});
	});
});
