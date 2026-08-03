import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initDatepickers } from '#/components/filters';
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

let calendar:
	| {
			init: ReturnType<typeof vi.fn>;
			set: ReturnType<typeof vi.fn>;
	  }
	| undefined;

vi.mock('vanilla-calendar-pro', () => ({
	Calendar: class {
		init: ReturnType<typeof vi.fn>;
		set: ReturnType<typeof vi.fn>;

		constructor() {
			calendar = {
				init: vi.fn(),
				set: vi.fn(),
			};

			this.init = calendar.init;
			this.set = calendar.set;
		}
	},
}));

describe('initializes', () => {
	beforeEach(() => {
		document.body.innerHTML = '';

		bind.mockClear();
		vi.mocked(createURLState).mockClear();
	});

	it('initializes every datepicker', () => {
		document.body.innerHTML = `
      <div data-slot="datepicker" data-filter-type="from">
        <input data-slot='datepicker-input' />
      </div>
      <div data-slot="datepicker" data-filter-type="to">
        <input data-slot='datepicker-input' />
      </div>
      <div data-slot="combobox" data-filter-type="series"></div>
    `;

		initDatepickers();

		expect(createURLState).toHaveBeenCalledTimes(2);
		expect(calendar?.init).toHaveBeenCalledTimes(1);
	});

	describe('ignores datepickers missing required data-attributes', () => {
		it('missing data-filter-type', () => {
			document.body.innerHTML = `
        <div data-slot="datepicker">
          <input data-slot='datepicker-input' />
        </div>
      `;

			initDatepickers();

			expect(createURLState).not.toHaveBeenCalled();
		});

		it('missing input with data-attribute datepicker-input', () => {
			document.body.innerHTML = `
        <div data-slot="datepicker" data-filter-type="from">
          <input />
        </div>
      `;

			initDatepickers();

			expect(createURLState).not.toHaveBeenCalled();
		});
	});

	it('calls createURLState() with correct filter key', () => {
		document.body.innerHTML = `
		  <div data-slot="datepicker" data-filter-type="from">
        <input data-slot='datepicker-input' />
      </div>
    `;
		initDatepickers();

		expect(createURLState).toHaveBeenCalledWith('from');
	});
});

describe('updates state', () => {
	let el: HTMLElement;
	let input: HTMLInputElement;
	let updateState: (set: (value: string | null) => void) => void;
	let updateUI: (value: string | null) => void;

	beforeEach(() => {
		document.body.innerHTML = '';

		bind.mockClear();
		vi.mocked(createURLState).mockClear();

		document.body.innerHTML = `
  		<div data-slot="datepicker" data-filter-type="from">
          <input data-slot='datepicker-input' />
      </div>
    `;

		initDatepickers();

		({ updateState, updateUI } = bind.mock.calls[0][0]);

		// biome-ignore lint/style/noNonNullAssertion: required here
		el = document.querySelector<HTMLElement>('[data-slot="datepicker"]')!;

		// biome-ignore lint/style/noNonNullAssertion: required here
		input = document.querySelector<HTMLInputElement>(
			'[data-slot="datepicker-input"]',
		)!;
	});

	it('updates input and calendar when URL state changes', () => {
		updateUI('2026-01-01');

		expect(input.value).toBe('2026-01-01');
		expect(el.dataset.value).toBe('2026-01-01');
		expect(calendar?.set).toHaveBeenCalledWith({
			selectedDates: ['2026-01-01'],
		});

		updateUI(null);
		expect(input.value).toBe('');
		expect(el.dataset.value).toBeUndefined();
		expect(calendar?.set).toHaveBeenCalledWith({
			selectedDates: [],
		});
	});

	it('responds to a datepicker:change event by calling set(value)', () => {
		const set = vi.fn();

		updateState(set);

		input.dispatchEvent(
			new CustomEvent('datepicker:change', {
				bubbles: true,
				detail: { value: '2026-01-01' },
			}),
		);

		input.dispatchEvent(
			new CustomEvent('datepicker:change', {
				bubbles: true,
				detail: { value: null },
			}),
		);

		expect(set).toHaveBeenNthCalledWith(1, '2026-01-01');
		expect(set).toHaveBeenNthCalledWith(2, null);
	});
});
