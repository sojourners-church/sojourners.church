import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createURLState, getURLState, resetURLState } from '#/lib/urlState';

describe('createURLState', () => {
	beforeEach(() => {
		history.replaceState({}, '', '/');
	});

	it('calls updateUI immediately with the current URL value', () => {
		history.replaceState({}, '', '/?series=romans');

		const updateUI = vi.fn();
		const updateState = vi.fn();

		createURLState('series').bind({
			updateUI,
			updateState,
		});

		expect(updateUI).toHaveBeenCalledOnce();
		expect(updateUI).toHaveBeenCalledWith('romans');
	});

	it('provides a setter function through updateState', () => {
		const updateUI = vi.fn();
		const updateState = vi.fn();

		createURLState('series').bind({
			updateUI,
			updateState,
		});

		expect(updateState).toHaveBeenCalledOnce();
		expect(updateState).toHaveBeenCalledWith(expect.any(Function));
	});

	it('updates the URL when the setter is called', () => {
		let setState!: (value: string) => void;

		createURLState('series').bind({
			updateUI: vi.fn(),
			updateState: (set) => {
				setState = set;
			},
		});

		setState('romans');

		expect(window.location.search).toBe('?series=romans');
	});

	it('removes the URL parameter when set to an empty value', () => {
		history.replaceState({}, '', '/?series=romans');

		let setState!: (value: string) => void;

		createURLState('series').bind({
			updateUI: vi.fn(),
			updateState: (set) => {
				setState = set;
			},
		});

		setState('');

		expect(window.location.search).toBe('');
	});

	it('notified subscribers when state changes', () => {
		let setState!: (value: string) => void;

		const updateUI = vi.fn();

		createURLState('series').bind({
			updateUI,
			updateState: (set) => {
				setState = set;
			},
		});

		setState('romans');

		expect(updateUI).toHaveBeenLastCalledWith('romans');
	});

	it('updates subscribers when browser navigation changes the URL', () => {
		const updateUI = vi.fn();

		createURLState('series').bind({
			updateUI,
			updateState: vi.fn(),
		});

		history.pushState({}, '', '/?series=acts');
		window.dispatchEvent(new PopStateEvent('popstate'));

		expect(updateUI).toHaveBeenLastCalledWith('acts');
	});

	it('stops updating after unsubscribe is called', () => {
		const updateUI = vi.fn();

		const unsubscribe = createURLState('series').bind({
			updateUI,
			updateState: vi.fn(),
		});

		expect(updateUI).toHaveBeenCalledOnce();

		unsubscribe();

		history.replaceState({}, '', '/?series=romans');
		window.dispatchEvent(new Event('urlstate:change'));

		expect(updateUI).toHaveBeenCalledOnce();
	});
});

describe('getURLState', () => {
	beforeEach(() => {
		history.replaceState({}, '', '/');
	});

	it('returns all URL state values', () => {
		history.replaceState(
			{},
			'',
			'/?series=romans&preacher=paul&from=2026-01-01&q=grace',
		);

		expect(getURLState()).toEqual({
			series: 'romans',
			preacher: 'paul',
			from: '2026-01-01',
			to: null,
			tag: null,
			query: 'grace',
		});
	});

	it('returns null for missing values', () => {
		expect(getURLState()).toEqual({
			series: null,
			preacher: null,
			from: null,
			to: null,
			tag: null,
			query: null,
		});
	});
});

describe('resetURLState', () => {
	beforeEach(() => {
		history.replaceState({}, '', '/');
	});

	it('clears all query parameters', () => {
		history.replaceState({}, '', '/?series=romans&tag=faith');

		resetURLState();

		expect(window.location.search).toBe('');
	});

	it('notifies subscribers that state changed', () => {
		const handler = vi.fn();

		window.addEventListener('urlstate:change', handler);

		resetURLState();

		expect(handler).toHaveBeenCalledOnce();

		window.removeEventListener('urlstate:change', handler);
	});
});
