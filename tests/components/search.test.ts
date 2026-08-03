import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initSearch } from '#/components/filters';
import { createCardData } from '#/components/filters/search/init';

const { FuseMock, bind } = vi.hoisted(() => ({
	FuseMock: vi.fn(),
	bind: vi.fn(),
}));

vi.mock('fuse.js', () => ({
	default: FuseMock,
}));

vi.mock('#/lib/urlState', () => ({
	createURLState: vi.fn(() => ({
		bind,
	})),
}));

let cards: NodeListOf<HTMLElement>;
let search: HTMLElement;
let input: HTMLInputElement;

beforeEach(() => {
	document.body.innerHTML = '';

	FuseMock.mockClear();
	bind.mockClear();

	document.body.innerHTML = `
    <div data-slot="search">
      <input data-slot="search-input" />
    </div>

    <div
      data-sermon-card
      data-title="Jesus Gone Missing"
      data-series="advent-2025-songs-of-advent"
      data-preacher="tyler-mykkanen"
      data-scriptures='["Luke.2.41", "Luke.2.42"]'
    ></div>

    <div
      data-sermon-card
      data-title="Gospel Encouragement for Everyday Life"
      data-series="thessalonians-gospel-encouragement-for-everyday-life"
      data-preacher="tyler-mykkanen"
      data-scriptures='[
      "1Thess"]'
    ></div>
  `;

	cards = document.querySelectorAll<HTMLElement>('[data-sermon-card]');
	//biome-ignore lint/style/noNonNullAssertion: ok here
	search = document.querySelector<HTMLElement>('[data-slot="search"]')!;
	//biome-ignore lint/style/noNonNullAssertion: ok here
	input = search.querySelector<HTMLInputElement>('input')!;
});

describe('createCardData', () => {
	it('creates card data from DOM elements', () => {
		expect(createCardData(cards)).toEqual([
			expect.objectContaining({
				title: 'Jesus Gone Missing',
				scriptures: ['Luke.2.41', 'Luke.2.42'],
			}),
			expect.objectContaining({
				title: 'Gospel Encouragement for Everyday Life',
			}),
		]);
	});
});

describe('initSearch', () => {
	it('creates a Fuse index from the cards', () => {
		initSearch(cards);

		expect(FuseMock).toHaveBeenCalledTimes(1);

		const [data, options] = FuseMock.mock.calls[0];

		expect(data).toHaveLength(2);

		expect(data[0]).toMatchObject({
			title: 'Jesus Gone Missing',
			series: 'advent-2025-songs-of-advent',
			preacher: 'tyler-mykkanen',
			scriptures: ['Luke.2.41', 'Luke.2.42'],
		});

		expect(options).toMatchObject({
			threshold: 0.35,
			includeScore: true,
			ignoreLocation: true,
		});
	});

	it('binds the search state', () => {
		initSearch(cards);

		expect(bind).toHaveBeenCalledTimes(1);

		const options = bind.mock.calls[0][0];

		expect(options.updateUI).toBeTypeOf('function');
		expect(options.updateState).toBeTypeOf('function');
	});

	it('updates the input and data attribute', () => {
		initSearch(cards);

		const { updateUI } = bind.mock.calls[0][0];

		updateUI('grace');

		expect(input.value).toBe('grace');
		expect(search.dataset.value).toBe('grace');

		updateUI(null);
		expect(input.value).toBe('');
		expect(search.dataset.value).toBeUndefined();
	});

	it('updates state when typing', () => {
		initSearch(cards);

		const { updateState } = bind.mock.calls[0][0];

		const set = vi.fn();

		updateState(set);

		input.value = 'Romans';
		search.dispatchEvent(new Event('input', { bubbles: true }));

		expect(set).toHaveBeenCalledWith('Romans');
	});

	it('does nothing if search element is missing', () => {
		document.body.innerHTML = '';

		initSearch(cards);

		expect(bind).not.toHaveBeenCalled();
	});

	it('does nothing if search input is missing', () => {
		document.body.innerHTML = `
      <div data-slot="search"></div>
    `;

		initSearch(cards);

		expect(bind).not.toHaveBeenCalled();
	});
});
