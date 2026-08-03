import {
	PUBLIC_GOOGLE_CALENDAR_API_KEY,
	PUBLIC_GOOGLE_CALENDAR_ID,
} from 'astro:env/client';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { Calendar } from 'fullcalendar';
import listPlugin from 'fullcalendar/list';
import themePlugin from 'fullcalendar/themes/classic';

import 'fullcalendar/skeleton.css';
import 'fullcalendar/themes/classic/theme.css';
import '#/styles/fullcalendar-theme.css';

export const init = (el: HTMLElement) => {
	const calendar = new Calendar(el, {
		plugins: [themePlugin, googleCalendarPlugin, listPlugin],
		initialView: 'listMonth',
		contentHeight: 'auto',
		events: {
			googleCalendarId: PUBLIC_GOOGLE_CALENDAR_ID,
			googleCalendarApiKey: PUBLIC_GOOGLE_CALENDAR_API_KEY,
		},
		headerToolbar: {
			left: 'title',
			right: 'today prev,next',
		},
		className: 'astro-church-cal',
		toolbarClass: 'toolbar',
		toolbarTitleClass: 'toolbar-title',
		buttonClass: 'button',
		buttonGroupClass: 'button-group',
		viewClass: 'view',
		listDayClass: 'list-day',
		listDayHeaderClass: 'list-day-header',
		listItemEventClass: 'list-item-event',
		listItemEventTitleClass: 'list-item-event-title',
		listItemEventBeforeClass: 'list-item-event-before',
	});

	calendar.render();
};
