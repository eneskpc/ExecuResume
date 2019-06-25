import React, { Component } from 'react';
import ResumeConsumer from '../Context';
import uuidv4 from 'uuid/v4';
import axios from 'axios';
import * as Vibrant from 'node-vibrant';
import { ServerAddress } from '../SystemVariables';

class CVResolver extends Component {
    state = {
        cvFiles: [],
        allowStartProcess: false,
        processPercent: 0
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
        let rejectedFiles = [];
        for (let index = 0; index < files.length; index++) {
            if (files[index].name.substring(files[index].name.length - 3).toLowerCase() === 'xml') {
                let result = await this.getBase64(files[index]);
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
            } else {
                rejectedFiles = [
                    ...rejectedFiles,
                    files[index].name
                ]
            }
        }
        if (rejectedFiles.length > 0)
            alert("Listelenen dosyalar uygun formatta değildir.\n- " + rejectedFiles.join('\n- '));

        this.setState({
            cvFiles: [
                ...this.state.cvFiles,
                ...tempCVFiles
            ]
        });

        if (this.state.cvFiles.length > 0 && !this.state.allowStartProcess) {
            this.setState({
                allowStartProcess: true
            });
        } else if (this.state.cvFiles.length === 0) {
            this.setState({
                allowStartProcess: false
            });
        }

        target.value = target.defaultValue;
    }

    onSubmit = async (dispatch, e) => {
        e.preventDefault();
        dispatch({
            type: 'CHANGE_VISIBLE',
            payload: true
        });

        const { cvFiles } = this.state;

        this.setState({
            processPercent: 0.0
        });

        const postResponse = {
            Successfuls: [],
            Faileds: []
        };
        window.processTime = 0;
        window.processInterval = setInterval(() => {
            window.processTime += 100;
        }, 100);
        for (let index = 0; index < cvFiles.length; index++) {
            let receivedResponse = await axios.post(`${ServerAddress}/api/resume/ready-data`, {
                FileData: cvFiles[index].file,
                FileName: cvFiles[index].name,
                OriginAddress: window.location.origin
            });

            this.setState({
                processPercent: (index + 1) / cvFiles.length * 100
            });

            if (receivedResponse) {
                if (receivedResponse.data != null)
                    postResponse.Successfuls = [
                        ...postResponse.Successfuls,
                        ...receivedResponse.data
                    ];
                else
                    postResponse.Faileds = [
                        ...postResponse.Faileds,
                        {
                            FileData: cvFiles[index].file,
                            FileName: cvFiles[index].name
                        }
                    ];
            }
        }

        if (postResponse != null) {
            for (let index = 0; index < postResponse.Successfuls.length; index++) {
                let rci = null;
                if (postResponse.Successfuls[index].CandidateImage.CandidateImageData) {
                    const result = await Vibrant.from('data:image/*;base64,' + postResponse.Successfuls[index].CandidateImage.CandidateImageData).getPalette();
                    rci = result.LightMuted.hex;
                }
                postResponse.Successfuls[index] = {
                    ...postResponse.Successfuls[index],
                    ResolvedColorOfImage: rci
                };
            }
            dispatch({
                type: 'RESOLVE_CV',
                payload: postResponse
            });
        }
        dispatch({
            type: 'CHANGE_VISIBLE',
            payload: false
        });
    }

    deleteSelectedFile = (elementId, dispatch, e) => {
        let newCVFiles = this.state.cvFiles.filter(file => file.key !== elementId);
        this.setState({
            cvFiles: newCVFiles,
            allowStartProcess: newCVFiles.length > 0 ? true : false
        });
    }

    render() {
        return (
            <ResumeConsumer>
                {
                    value => {
                        const { dispatch, fromXML } = value;
                        return (
                            fromXML ?
                                <div>
                                    <form onSubmit={this.onSubmit.bind(this, dispatch)} className="row">
                                        <div className="col-12">
                                            <hr className="my-4" />
                                        </div>
                                        <div className="col-12 d-md-flex justify-md-content-between align-items-md-center text-md-left text-center">
                                            <div className="custom-file">
                                                <input multiple type="file" accept=".xml" className="custom-file-input" onChange={this.onFileChange} />
                                                <label className="custom-file-label">Dosyaları Seç</label>
                                            </div>
                                            <button disabled={!this.state.allowStartProcess} type="submit" className="btn btn-primary btn-sm ml-md-5 mt-3 mt-md-0 text-nowrap">
                                                <i className="fas fa-play mr-2"></i>
                                                XML'den Oku
                                        </button>
                                        </div>
                                        <div className={'col-12 mt-4' + (this.state.cvFiles.length === 0 ? ' d-none' : '')} style={{ overflowY: "auto", maxHeight: "225px" }}>
                                            {
                                                this.state.cvFiles.map((fileInfo, index) => {
                                                    return (
                                                        <div key={fileInfo.key}>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div>
                                                                    <i className={fileInfo.name.substring(fileInfo.name.length - 3) === 'doc' ||
                                                                        fileInfo.name.substring(fileInfo.name.length - 4) === 'docx' ? 'fas fa-file-word text-primary' : 'fas fa-file-pdf text-danger'}></i>
                                                                    <strong className="ml-2">{fileInfo.name}</strong>
                                                                </div>
                                                                <button onClick={this.deleteSelectedFile.bind(this, fileInfo.key, dispatch)} type="button" className="btn btn-outline-secondary btn-sm">&#128465;</button>
                                                            </div>
                                                            <hr className={'my-2' + (this.state.cvFiles.length - 1 === index ? ' d-none' : '')} />
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </form>
                                    <div className="progressbar-container-in-loading-box">
                                        <div className="progress">
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: this.state.processPercent + '%' }}></div>
                                        </div>
                                        <div>Lütfen Bekleyiniz. Yaklaşık {(this.state.processPercent || 0.0).toFixed(2)}% oranında tamamlandı.</div>
                                    </div>
                                </div> : null
                        )
                    }
                }
            </ResumeConsumer>
        )
    }
}
export default CVResolver;