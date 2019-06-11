import '../App.css';
import React, { Component } from 'react';
import ResumeConsumer from '../Context';

class CVResolver extends Component {
    onFileChange = (dispatch, e) => {
        const { target } = e;
        const { files } = target;
        dispatch({
            type: 'ADD_FILES',
            payload: files
        }).then(response => {
            target.value = target.defaultValue;
        });
    }

    deleteSelectedFile = (elementId, dispatch, e) => {
        dispatch({
            type: 'DELETE_FILE',
            payload: elementId
        }).then(response => {
            
        });
    }

    render() {
        return (
            <ResumeConsumer>
                {
                    value => {
                        const { cvFiles, isVisible, dispatch } = value;
                        return (
                            <div className={(isVisible ? ' loading-box' : '')}>
                                <form onSubmit={this.onSubmit} className="row">
                                    <div className="col-12">
                                        <hr className="my-4" />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="custom-file">
                                            <input multiple type="file" name="cv-files[]" className="custom-file-input" onChange={this.onFileChange.bind(this, dispatch)} />
                                            <label className="custom-file-label">Choose files</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6"></div>
                                    <div className={'col-md-6 mt-4' + (cvFiles.length === 0 ? ' d-none' : '')}>
                                        {
                                            cvFiles.map((fileInfo, index) => {
                                                return (
                                                    <div key={fileInfo.key}>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <strong>{fileInfo.name}</strong>
                                                            <button onClick={this.deleteSelectedFile.bind(this, fileInfo.key, dispatch)} type="button" className="btn btn-outline-secondary btn-sm">&#128465;</button>
                                                        </div>
                                                        <hr className={'my-2' + (cvFiles.length - 1 === index ? ' d-none' : '')} />
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
                            </div>
                        )
                    }
                }
            </ResumeConsumer>
        )
    }
}
export default CVResolver;