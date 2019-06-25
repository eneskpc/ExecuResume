import React, { Component } from 'react'
import ResumeConsumer from '../Context';
import jsontoxml from 'jsontoxml';
import { Base64 } from 'js-base64';
import Axios from 'axios';
import { ServerAddress, FilesPath } from '../SystemVariables';

export default class CVInfoShowerByGrid extends Component {
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
        document.querySelectorAll('td .custom-switch input[type=checkbox]').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.click();
        });
    }

    DeselectedAllResumes = (e) => {
        document.querySelectorAll('td .custom-switch input[type=checkbox]').forEach(checkbox => {
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

    render() {
        return (
            <ResumeConsumer>
                {
                    value => {
                        const { cvInfos, selectedPersons, dispatch, gridView } = value;
                        return (
                            <div>
                                {
                                    cvInfos.Resumes.length > 0 && gridView ?
                                        <div className="container mt-5">
                                            <div id="iframeModal" className={'es-modal' + (!this.state.showExecuSelectResumeModal ? ' d-none' : '')}>
                                                <div className="position-relative">
                                                    <button className="close-button" onClick={this.toggleExecuSelectResumeModal}>&times;</button>
                                                    <iframe src="data:text/html;charset:UTF-8,<h1></h1>" width="100%" height="100%" title="#" />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <table className="table table-hover bg-white border">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">&nbsp;</th>
                                                                <th scope="col">Ad Soyad</th>
                                                                <th scope="col">Ünvan</th>
                                                                <th scope="col">E-Posta</th>
                                                                <th scope="col">Telefon</th>
                                                                <th scope="col">Dosya</th>
                                                                <th scope="col">&nbsp;</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                cvInfos.FilteredResumes.map((cv, index) => {
                                                                    return (
                                                                        <tr key={cv.Resume.UniqueKey} className={cv.Resume.Gender && (cv.Resume.Gender.toLocaleLowerCase() === 'female' || cv.Resume.Gender.toLocaleLowerCase() === 'bayan') ? 'bg-danger text-white' : 'bg-info text-white'}>
                                                                            <td>
                                                                                <div className="custom-control custom-switch" >
                                                                                    <input type="checkbox" className="custom-control-input" id={cv.Resume.UniqueKey} onChange={this.onToggleCheckbox.bind(this, dispatch)} checked={this.indexOfForSelected(selectedPersons, cv.Resume)} />
                                                                                    <label htmlFor={cv.Resume.UniqueKey} className="custom-control-label"></label>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                {cv.Resume.FirstName} {cv.Resume.LastName}
                                                                            </td>
                                                                            <td>
                                                                                {cv.Resume.Category}
                                                                            </td>
                                                                            <td>
                                                                                {cv.Resume.Email}
                                                                            </td>
                                                                            <td>
                                                                                {cv.Resume.Phone}
                                                                            </td>
                                                                            <td className="cursor-pointer" onClick={this.onViewWordResumeByHTML.bind(this, cv.Resume)}>
                                                                                {cv.Resume.ResumeFileName}
                                                                            </td>
                                                                            <td className="text-right">
                                                                                <i className="fas fa-search ml-2 cursor-pointer" onClick={this.onViewExecuSelectResume.bind(this, cv.Resume)}></i>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="col-12 text-right">
                                                    <div className="form-group">
                                                        <a className="btn btn-sm btn-info mr-2" download='ResumesOfSelectedPersons.xml' href={'data:application/xml;base64,' + Base64.encode(jsontoxml(selectedPersons, {
                                                            xmlHeader: {
                                                                standalone: true
                                                            }
                                                        }))}>Seçili Özgeçmişleri XML Olarak Kaydet</a>
                                                        <button type="button" className="btn btn-sm btn-outline-info mr-2" onClick={this.SelectedAllResumes}>Tüm Özgeçmişleri Seç</button>
                                                        <button type="button" className="btn btn-sm btn-outline-info" onClick={this.DeselectedAllResumes}>Tüm Özgeçmişlerin Seçimini Kaldır</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null
                                }
                            </div>
                        )
                    }
                }
            </ResumeConsumer>
        )
    }
}
