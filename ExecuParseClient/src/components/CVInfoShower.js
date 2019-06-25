import React, { Component } from 'react'
import ResumeConsumer from '../Context';
import jsontoxml from 'jsontoxml';
import { Base64 } from 'js-base64';
import male from '../male.png';
import female from '../female.png';
import Axios from 'axios';
import { ServerAddress, FilesPath } from '../SystemVariables';

export default class CVInfoShower extends Component {
    state = {
        showExecuSelectResumeModal: false
    };

    onAddSelectedPerson = (dispatch, e) => {
        dispatch({
            type: 'ADD_SELECTED_PERSON',
            payload: e.target.id
        });
    }

    onRemoveSelectedPerson = (dispatch, e) => {
        dispatch({
            type: 'REMOVE_SELECTED_PERSON',
            payload: e.target.id
        });
    }

    onToggleCheckbox = (dispatch, e) => {
        if (e.target.checked) {
            this.onAddSelectedPerson(dispatch, e);
        } else {
            this.onRemoveSelectedPerson(dispatch, e);
        }
    }

    SelectedAllResumes = (e) => {
        document.querySelectorAll('.resume-switch input[type=checkbox]').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.click();
        });
    }

    DeselectedAllResumes = (e) => {
        document.querySelectorAll('.resume-switch input[type=checkbox]').forEach(checkbox => {
            checkbox.checked = true;
            checkbox.click();
        });
    }

    onViewExecuSelectResume = (personData, e) => {
        document.getElementById('iframeModal').querySelector('iframe').src = 'data:text/html;base64,' +
            Base64.encode('<div style="display:flex;justify-content:center;align-items:center;position:absolute;left:0;top:0;width:100%;height:100%;font-family:Tahoma,sans-serif;color:#fff;"><h1>Haz&#305;rlan&#305;yor...</h1></div>');
        this.toggleExecuSelectResumeModal();
        Axios.post(`${ServerAddress}/api/resume/view-format`, personData).then(response => {
            document.getElementById('iframeModal').querySelector('iframe').src = 'data:text/html;base64,' +
                Base64.encode(response.data);
        });
    }

    onViewWordResumeByHTML = (personData, e) => {
        document.getElementById('iframeModal').querySelector('iframe').src = `http://docs.google.com/gview?url=${ServerAddress}/${FilesPath}/${personData.TempURL}&embedded=true`;
        this.toggleExecuSelectResumeModal();
    }

    toggleExecuSelectResumeModal = () => {
        this.setState({
            showExecuSelectResumeModal: !this.state.showExecuSelectResumeModal
        });
    }

    indexOfForSelected = (selectedPersons, personData) => {
        return personData && typeof selectedPersons.Resumes.find(p => p.Resume.UniqueKey === personData.UniqueKey) === "object";
    }

    msToTime = (duration) => {
        let seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    createXMLFile = (sPersons) => {
        return 'data:application/xml;base64,' + Base64.encode(jsontoxml(sPersons, {
            xmlHeader: {
                standalone: true
            }
        }));
    }

    onClickExcel = (sPersons, e) => {
    }

    render() {
        return (
            <ResumeConsumer>
                {
                    value => {
                        const { cvInfos, selectedPersons, dispatch, gridView } = value;
                        return (
                            <div>
                                {
                                    cvInfos.Resumes.length > 0 && !gridView ?
                                        <div className="container mt-5">
                                            <div id="iframeModal" className={'es-modal' + (!this.state.showExecuSelectResumeModal ? ' d-none' : '')}>
                                                <div className="position-relative">
                                                    <button className="close-button" onClick={this.toggleExecuSelectResumeModal}>&times;</button>
                                                    <iframe src="data:text/html;charset:UTF-8,<h1></h1>" width="100%" height="100%" title="#" />
                                                </div>
                                            </div>
                                            <div className="row">
                                                {
                                                    cvInfos.FilteredResumes.map((cv, index) => {
                                                        return (
                                                            <div key={cv.Resume.UniqueKey} className="col-lg-3 col-md-4 col-sm-6">
                                                                <div className="custom-control custom-switch resume-switch" >
                                                                    <input type="checkbox" className="custom-control-input" id={cv.Resume.UniqueKey} checked={this.indexOfForSelected(selectedPersons, cv.Resume)} onChange={this.onToggleCheckbox.bind(this, dispatch)} />
                                                                    <label htmlFor={cv.Resume.UniqueKey} className="custom-control-label"></label>
                                                                </div>
                                                                <div className="card mb-3">
                                                                    <div style={cv.Resume.CandidateImage.CandidateImageData
                                                                        ? { backgroundColor: cv.Resume.ResolvedColorOfImage }
                                                                        : {}} className={'custom-thumbnail text-center' + (cv.Resume.CandidateImage.CandidateImageData ? '' : ' bg-secondary')}>
                                                                        <div className={'rounded-circle d-inline-block border' + (cv.Resume.CandidateImage.CandidateImageData ? '' : ' border-secondary')} style={cv.Resume.CandidateImage.CandidateImageData
                                                                            ? { borderColor: cv.Resume.ResolvedColorOfImage } : {}}>
                                                                            <img src={cv.Resume.CandidateImage.CandidateImageData
                                                                                ? 'data:image/*;base64,' + cv.Resume.CandidateImage.CandidateImageData
                                                                                : (cv.Resume.Gender && (cv.Resume.Gender.toLocaleLowerCase() === 'female' || cv.Resume.Gender.toLocaleLowerCase() === 'bayan')
                                                                                    ? female : male)} alt={cv.Resume.FirstName + ' ' + cv.Resume.LastName} className="card-img" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="card-body text-center position-relative">
                                                                        <p className="card-text font-weight-bold">{cv.Resume.FirstName} {cv.Resume.LastName}</p>
                                                                        <p className="card-text">{cv.Resume.Category}</p>
                                                                        <p className="card-text">{cv.Resume.Email}</p>
                                                                        <p className="card-text">{cv.Resume.Phone}</p>
                                                                        <p className="card-text text-muted fixed-to-bottom">
                                                                            <span className="text-muted">{cv.Resume.ResumeFileName}</span>
                                                                            <i className="fas fa-search ml-2 cursor-pointer" onClick={this.onViewWordResumeByHTML.bind(this, cv.Resume)}></i>
                                                                        </p>
                                                                    </div>
                                                                    <div className="list-group list-group-flush">
                                                                        <button onClick={this.onViewExecuSelectResume.bind(this, cv.Resume)} className="list-group-item list-group-item-action text-center">
                                                                            ExecuSelect Özgeçmişi
                                                                            <i className="far fa-eye ml-2"></i>
                                                                        </button>
                                                                    </div>
                                                                    <div className="card-footer text-center">
                                                                        {cv.Resume.Gender && (cv.Resume.Gender.toLocaleLowerCase() === 'female' || cv.Resume.Gender.toLocaleLowerCase() === 'bayan')
                                                                            ? <i className="fa fa-venus fa-2x text-danger"></i> : <i className="fa fa-mars fa-2x text-info"></i>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                <div className="col-12 text-right">
                                                    <div className="form-group">
                                                        <strong className="mr-2">{this.msToTime(window.processTime)} sürdü.</strong>
                                                        <button type="button" className="btn btn-sm btn-outline-success" onClick={this.onClickExcel.bind(this, selectedPersons)}>Excel olarak</button>
                                                        <a className="btn btn-sm btn-info mr-2" download='ResumesOfSelectedPersons.xml' href={this.createXMLFile(selectedPersons)}>Seçili Özgeçmişleri XML Olarak Kaydet</a>
                                                        <button type="button" className="btn btn-sm btn-outline-info mr-2" onClick={this.SelectedAllResumes}>Tüm Özgeçmişleri Seç</button>
                                                        <button type="button" className="btn btn-sm btn-outline-info" onClick={this.DeselectedAllResumes}>Tüm Özgeçmişlerin Seçimini Kaldır</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null
                                }
                                <hr className={"my-4" + (cvInfos.FailedDocs.length === 0 ? ' d-none' : '')} />
                                <div className={"container mt-3" + (cvInfos.FailedDocs.length === 0 ? ' d-none' : '')}>
                                    <div className="alert alert-danger">
                                        {
                                            cvInfos.FailedDocs.map((file, index) => {
                                                return (
                                                    <div key={file.UniqueKey}>
                                                        <i className={file.FileName.substring(file.FileName.length - 3) === 'doc' ||
                                                            file.FileName.substring(file.FileName.length - 4) === 'docx' ? 'fas fa-file-word text-primary' : 'fas fa-file-pdf text-danger'}></i>
                                                        <strong className="ml-2">{file.FileName}</strong>
                                                        <hr className={'my-2' + (cvInfos.FailedDocs.length - 1 === index ? ' d-none' : '')} />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
            </ResumeConsumer>
        )
    }
}
