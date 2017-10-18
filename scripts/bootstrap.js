import React from 'react';
import {render} from 'react-dom';
import Page from './page';

const dest = document.getElementById('content');

const renderApp = RootComponent => {
	render(
		<RootComponent />,
		dest
	);
};

renderApp(Page);

if (module.hot) {
	module.hot.accept(
		'./page',
		() => {
			const ReloadedPage = require('./page');
			renderApp(ReloadedPage);
		}
	);
}
