import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initComboboxes } from '#/components/filters';
import { createURLState } from '#/lib/urlState';

const bind =
	vi.fn<
		(options: {
			updateUI: (value: string | null) => void;
			updateState: (set: (value: string | null) => void) => void;
		}) => void
	>();

vi.mock('#/lib/urlState', () => ({
	createURLState: vi.fn(() => ({
		bind,
	})),
}));

describe('initializes', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
		vi.clearAllMocks();
	});

	it('initializes every combobox', () => {
		document.body.innerHTML = `
      <div data-slot="combobox" data-filter-type="series"></div>
      <div data-slot="combobox" data-filter-type="speaker"></div>
      <div data-slot="datepicker" data-filter-type="from"></div>
    `;
		initComboboxes();

		expect(createURLState).toHaveBeenCalledTimes(2);
	});

	it('ignores comboboxes without filterType', () => {
		document.body.innerHTML = `
      <div data-slot="combobox"></div>
    `;
		initComboboxes();

		expect(createURLState).not.toHaveBeenCalled();
	});

	it('calls createURLState() with correct filter key', () => {
		document.body.innerHTML = `
      <div data-slot="combobox" data-filter-type="series"></div>
    `;
		initComboboxes();

		expect(createURLState).toHaveBeenCalledWith('series');
	});
});

describe('updates state', () => {
	let el: HTMLElement;
	let updateState: (set: (value: string | null) => void) => void;
	let updateUI: (value: string | null) => void;

	beforeEach(() => {
		document.body.innerHTML = `
      <div data-slot="combobox" data-filter-type="series"></div>
    `;

		vi.clearAllMocks();

		initComboboxes();

		// biome-ignore lint/style/noNonNullAssertion: required here
		el = document.querySelector<HTMLElement>('[data-slot="combobox"]')!;

		({ updateState, updateUI } = bind.mock.calls[0][0]);
	});

	it('dispatches a combobox:set event with expected value', () => {
		const listener = vi.fn();
		el?.addEventListener('combobox:set', listener);

		updateUI('Revelation');
		updateUI(null);

		expect(listener).toHaveBeenCalledTimes(2);
		expect(listener.mock.calls[0][0].detail.value).toBe('Revelation');
		expect(listener.mock.calls[1][0].detail.value).toBe(null);
	});

	it('responds to a combobox:change event by calling set(value)', () => {
		const set = vi.fn();

		updateState(set);

		el?.dispatchEvent(
			new CustomEvent('combobox:change', { detail: { value: 'Revelation' } }),
		);

		el?.dispatchEvent(
			new CustomEvent('combobox:change', { detail: { value: null } }),
		);

		expect(set).toHaveBeenNthCalledWith(1, 'Revelation');
		expect(set).toHaveBeenNthCalledWith(2, null);
	});
});
