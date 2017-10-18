import React, { Component } from 'react';
import Cropper from 'cropperjs';

export default class CropperWrapper extends Component {

    // variables
    cropper = null;
    options = {
        checkCrossOrigin: false,
        src: null,
        restore: false,
        viewMode: 1,
        scalable: false,
        movable: false,
        rotatable: false,
        enable: true,
        zoomable: false,
        responsive: true
    };

    componentDidMount() {
        this._initCropper();
        setTimeout(() => {
            this.cropImage();
        }, 1000);
    }

    cropImage() {
        if (!this.cropper || typeof this.cropper.getCroppedCanvas() === 'undefined') {
            return;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.src !== nextProps.src) {
            this.cropper.reset().clear().replace(nextProps.src);
        }
    }

    componentWillUnmount() {
        this.cropper && this.cropper.destroy();
    }

    /**
     * Start cropper
     * @param {base64} img
     */
    _initCropper() {
        const { imageRef } = this.refs;
        const {...options} = this.props;

        delete options.src;
        delete options.onChangeCropp;

        // cropper is inited
        if (!this.cropper) {
            this.cropper = new Cropper(imageRef, {
                ...this.options,
                ...options
            });
        }
    }

    render() {
        const { src } = this.props;
        return (
            <div
                style={{height: 300, width: '100%'}}>
                <img
                    ref="imageRef"
                    src={src}
                    style={{opacity: 0}} />
            </div>
        );
    }
}
