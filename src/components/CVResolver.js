import React, { Component } from 'react';
import ResumeConsumer from '../Context';
import uuidv4 from 'uuid/v4';
import axios from 'axios';

class CVResolver extends Component {
    state = {
        cvFiles: [],
        process: {
            loadedByte: 0,
            totalByte: 100
        }
    }

    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function () {
                reject();
            };
        });
    }

    onFileChange = async (e) => {
        const { target } = e;
        const { files } = target;

        let tempCVFiles = [];
        for (let index = 0; index < files.length; index++) {
            let result = await this.getBase64(files[index]);
            result = result.substring(result.indexOf(',') + 1, result.length - 1);
            if (this.state.cvFiles.filter(file => file.file === result).length === 0) {
                tempCVFiles = [
                    ...tempCVFiles,
                    {
                        key: uuidv4(),
                        file: result,
                        name: files[index].name
                    }
                ];
            }
        }

        this.setState({
            cvFiles: [
                ...this.state.cvFiles,
                ...tempCVFiles
            ]
        });

        target.value = target.defaultValue;
    }

    onSubmit = async (dispatch, e) => {
        e.preventDefault();
        dispatch({
            type: 'TOGGLE_VISIBLE',
            payload: null
        });

        const { cvFiles } = this.state;

        let cvAllData = [];
        for (let index = 0; index < cvFiles.length; index++) {
            cvAllData = [
                ...cvAllData,
                {
                    FileData: cvFiles[index].file,
                    FileName: cvFiles[index].name
                }
            ];
        }
        let postResponse = await axios.post("http://localhost:63217/api/resume/multiple", { resumeList: cvAllData }, {
            onUploadProgress: (progressInfo) => {
                if (progressInfo.loaded === progressInfo.total) {
                    this.setState({
                        process: {
                            loadedByte: 0,
                            totalByte: 100
                        }
                    });
                } else {
                    this.setState({
                        process: {
                            loadedByte: progressInfo.loaded,
                            totalByte: progressInfo.total
                        }
                    });
                }
            },
            onDownloadProgress: (progressInfo) => {
                if (progressInfo.loaded === progressInfo.total) {
                    this.setState({
                        process: {
                            loadedByte: 0,
                            totalByte: 100
                        }
                    });
                } else {
                    this.setState({
                        process: {
                            loadedByte: progressInfo.loaded,
                            totalByte: progressInfo.total
                        }
                    });
                }
            }
        }).catch(err => {
            alert(JSON.stringify(err));
        });
        if (postResponse.data) {
            dispatch({
                type: 'RESOLVE_CV',
                payload: postResponse.data
            });
            dispatch({
                type: 'TOGGLE_VISIBLE',
                payload: null
            });
        } else {

        }
    }

    deleteSelectedFile = (elementId, dispatch, e) => {
        this.setState({
            cvFiles: this.state.cvFiles.filter(file => file.key !== elementId)
        });
    }

    render() {
        return (
            <ResumeConsumer>
                {
                    value => {
                        const { dispatch } = value;
                        return (
                            <div>
                                <form onSubmit={this.onSubmit.bind(this, dispatch)} className="row">
                                    <div className="col-12">
                                        <hr className="my-4" />
                                    </div>
                                    <div className="col-lg-6 col-md-8">
                                        <div className="custom-file">
                                            <input multiple type="file" name="cv-files[]" className="custom-file-input" onChange={this.onFileChange} />
                                            <label className="custom-file-label">Choose files</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6"></div>
                                    <div className={'col-lg-6 col-md-8 mt-4' + (this.state.cvFiles.length === 0 ? ' d-none' : '')} style={{ overflowY: "auto", maxHeight: "150px" }}>
                                        {
                                            this.state.cvFiles.map((fileInfo, index) => {
                                                return (
                                                    <div key={fileInfo.key}>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <strong>{fileInfo.name}</strong>
                                                            <button onClick={this.deleteSelectedFile.bind(this, fileInfo.key, dispatch)} type="button" className="btn btn-outline-secondary btn-sm">&#128465;</button>
                                                        </div>
                                                        <hr className={'my-2' + (this.state.cvFiles.length - 1 === index ? ' d-none' : '')} />
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                    <div className="col-12">
                                        <hr className="my-4" />
                                        <input type="submit" className="btn btn-primary" value="Start Resolve Resume" />
                                    </div>
                                </form>
                                <div className="progressbar-container-in-loading-box">
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: (this.state.process.loadedByte / this.state.process.totalByte * 100) + '%' }}></div>
                                    </div>
                                    <div>Please wait. {this.state.process.loadedByte / this.state.process.totalByte * 100}% of process completed</div>
                                </div>
                            </div>
                        )
                    }
                }
            </ResumeConsumer>
        )
    }
}
export default CVResolver;