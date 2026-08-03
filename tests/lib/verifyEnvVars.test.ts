import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:fs', () => ({
	default: {
		readFileSync: vi.fn(),
	},
}));

import fs from 'node:fs';

import { verifyRequiredEnvVars } from '#/lib/verifyEnvVars';

const mockedFs = vi.mocked(fs);

describe('verifyEnvVars', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		delete process.env.RESEND_API_KEY;
		delete process.env.RESEND_SEGMENT_ID;
		delete process.env.PUBLIC_GOOGLE_CALENDAR_API_KEY;
		delete process.env.PUBLIC_GOOGLE_CALENDAR_ID;
	});

	it('requires Resed env vars when subscribe is active', () => {
		mockConfigFiles({ subscribe: true });

		expect(() => verifyRequiredEnvVars()).toThrow(
			'Missing required environment variable: RESEND_API_KEY',
		);
	});

	it('does not require Resed env vars when subscribe is disabled', () => {
		mockConfigFiles({});

		expect(() => verifyRequiredEnvVars()).not.toThrow();
	});

	it('requires Google Calendar env vars when calendar is enabled', () => {
		mockConfigFiles({ calendar: true });

		expect(() => verifyRequiredEnvVars()).toThrow(
			'Missing required environment variable: PUBLIC_GOOGLE_CALENDAR_API_KEY',
		);
	});

	it('passes when all required env vars exist', () => {
		process.env.RESEND_API_KEY = 'x';
		process.env.RESEND_SEGMENT_ID = 'x';
		process.env.PUBLIC_GOOGLE_CALENDAR_API_KEY = 'x';
		process.env.PUBLIC_GOOGLE_CALENDAR_ID = 'x';

		mockConfigFiles({ subscribe: true, calendar: true });

		expect(() => verifyRequiredEnvVars()).not.toThrow();
	});
});

const mockConfigFiles = ({ subscribe = false, calendar = false }) => {
	mockedFs.readFileSync.mockImplementation((file) => {
		const filename = String(file);

		if (filename.endsWith('footer.yaml')) {
			return `
      subscribe:
        isActive: ${subscribe}
      `;
		}

		if (filename.endsWith('navigation.yaml')) {
			return calendar
				? `
        navigationEntries:
          - navigationEntryType: feature
            featureType: calendar
        `
				: `
        navigationEntries: []
        `;
		}

		throw new Error(`Unexpected config file: ${filename}`);
	});
};
