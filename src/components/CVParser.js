import React, { Component } from 'react';
import axios from 'axios';
import uuidv4 from 'uuid/v4';

class CVParser extends Component {
    state = {
        cvFiles: [],
        isVisible: false,
        cvInfos =[]
    };
    onSubmit = (e) => {
        e.preventDefault();

        if (this.state.isVisible)
            return false;

        this.setState({
            cvInfos: [],
            isVisible: true
        });
        const { cvFiles } = this.state;

        for (let index = 0; index < cvFiles.length; index++) {
            ((fileInfo, i) => {
                axios.post("http://localhost:63217/api/resume", {
                    FileData: fileInfo.file,
                    FileName: fileInfo.name
                }).then(response => {
                    cvInfos.push(response.data);
                    if (i === this.state.cvFiles.length - 1)
                        this.setState({
                            isVisible: false
                        });
                });
            })(cvFiles[index], index);
        }
    };
    onFileChange = (e) => {
        const { files } = e.target;
        for (let index = 0; index < files.length; index++) {
            ((file, i) => {
                this.getBase64(files[i], (result) => {
                    this.setState({
                        cvFiles: [
                            ...this.state.cvFiles,
                            {
                                key: uuidv4(),
                                file: result ? result.substring(result.indexOf(',') + 1, result.length - 1) : null,
                                name: file.name
                            }
                        ],
                    });
                });
            })(files[index], index);
        }
    }
    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    deleteSelectedFile = (elementId, e) => {
        this.setState({
            cvFiles: this.state.cvFiles.filter(cv => elementId !== cv.key)
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit} className="row">
                    <div className="col-12">
                        <hr className="my-4" />
                    </div>
                    <div className="col-md-6">
                        <div className="custom-file">
                            <input type="file" name="cv-file" className="custom-file-input" onChange={this.onFileChange} />
                            <label className="custom-file-label">Choose files</label>
                        </div>
                    </div>
                    <div className={'col-12 mt-4' + (this.state.cvFiles.length === 0 ? ' d-none' : '')}>
                        {
                            this.state.cvFiles.map(fileInfo => {
                                return (
                                    <div className="d-flex justify-content-between align-items-center" a-id={fileInfo.key} key={fileInfo.key}>
                                        <strong>{fileInfo.name}</strong>
                                        <button onClick={this.deleteSelectedFile.bind(this, fileInfo.key)} type="button" className="btn btn-danger btn-sm">&times;</button>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="col-12">
                        <hr className="my-4" />
                        <input type="submit" className={"btn btn-primary" + (this.state.isVisible ? ' disabled' : '')} value={this.state.isVisible ? 'Please wait. This process may take a few minutes.' : 'Start Parse Resume'} />
                    </div>
                </form>
            </div>
        )
    }
}
export default CVParser;