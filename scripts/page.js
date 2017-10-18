import React, {Component} from 'react';
import Cropper from './cropperWrapper';

export default class PageCropper extends Component {

    constructor() {
        super();
        this.state = {
            img: null
        };
    }

    componentDidMount() {
        this._getFileToBase64('/assets/defaultImage.jpg');
    }

    render() {
        const {img} = this.state;
        return (
            <div className="row container mt-3 mx-auto" style={{width: '100%', maxWidth: '100%'}}>
                <div className="col-md-6">
                    <button
                        onClick={() => this.refs.fileInput.click()}
                        className="col-md-6 btn btn-primary">
                        Nahrát nový obrázek
                    </button>
                </div>
                <div className="col-md-6 text-right">
                    <button
                        className="btn btn-success"
                        onClick={this._handleSendToServer}>
                        Odeslat na server
                    </button>
                </div>
                <input
                    ref="fileInput"
                    type="file"
                    className="d-none"
                    accept=".png, .jpg, .jpeg"
                    onChange={this._handleOnChangeFile} />

                {img && (
                    <div className="wrapper col-md-12 mt-3">
                        <div className="mx-auto" style={{width: '100%'}}>
                            <Cropper
                                src={img}
                                ref="cropperContainer" />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    /**
     * Convert selected file to base 64
     */
    _handleOnChangeFile = (event) => {
        let file;
        if (event.dataTransfer) {
          file = event.dataTransfer.files[0];
        }
        else if (event.target) {
            file = event.target.files[0];
        }

        if (!file) {
            alert('Prosím, vyberte soubor.');
            return false;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.setState({
                img: reader.result
            });
        };
    }

    /**
     * Convert file from url to base64
     * @param {string} imgUrl
     */
    _getFileToBase64(imgUrl) {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            var reader = new FileReader();
            reader.onloadend = () => {
                this.setState({
                    img: reader.result
                });
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', imgUrl);
        xhr.responseType = 'blob';
        xhr.send();
    }

    /**
     * Send to server
     */
    _handleSendToServer = () => {
        const {cropperContainer} = this.refs;
        const base64 = cropperContainer.cropper.getCroppedCanvas().toDataURL();

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/test/cropper', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({
            base64
        }));
    }
}
