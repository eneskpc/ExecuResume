import React, { Component } from 'react'
import ResumeConsumer from '../Context';
import jsontoxml from 'jsontoxml';
import { Base64 } from 'js-base64';

export default class CVInfoShower extends Component {
    onChangePerson = (dispatch, e) => {
        dispatch({
            type: 'CHANGE_SELECTED_PERSON_KEY',
            payload: e.target.value
        });
    }

    render() {
        return (
            <ResumeConsumer>
                {
                    value => {
                        const { cvInfos, selectedPerson, dispatch } = value;
                        return (
                            cvInfos.length > 0 ?
                                <div className="container mt-3">
                                    <div className="jumbotron">
                                        <select className="custom-select" value={selectedPerson.UniqueKey} onChange={this.onChangePerson.bind(this, dispatch)}>
                                            {
                                                cvInfos.map((cv, index) => {
                                                    return <option key={cv.UniqueKey} value={cv.UniqueKey}>{cv.FirstName} {cv.LastName}</option>
                                                })
                                            }
                                        </select>
                                        <a className="btn btn-outline-success btn-sm" download={selectedPerson.FirstName + ' ' + selectedPerson.LastName + '.xml'} href={'data:application/xml;base64,' + Base64.encode(jsontoxml(selectedPerson, {
                                            xmlHeader: {
                                                standalone: true
                                            }
                                        }))}>Download by XML File</a>
                                    </div>
                                </div>
                                : null
                        )
                    }
                }
            </ResumeConsumer>
        )
    }
}
