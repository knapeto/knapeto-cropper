import React from 'react';
import {render} from 'react-dom';
import Cropper from './cropper';

const dest = document.getElementById('content');

const renderApp = RootComponent => {
	render(
		<RootComponent />,
		dest
	);
};

renderApp(Cropper);

if (module.hot) {
	module.hot.accept(
		'./cropper',
		() => {
			const ReloadedCropper = require('./cropper');
			renderApp(ReloadedCropper);
		}
	);
}
