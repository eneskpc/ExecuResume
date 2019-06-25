import React, { Component } from 'react';
import uuidv4 from 'uuid/v4';

const ResumeContext = React.createContext();
const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'CHANGE_VISIBLE':
            return {
                ...state,
                isVisible: payload
            }
        case 'TOGGLE_VISIBLE':
            return {
                ...state,
                isVisible: !state.isVisible
            }
        case 'TOGGLE_GRID':
            return {
                ...state,
                gridView: !state.gridView
            }
        case 'TOGGLE_PROCESS_SCREEN':
            return {
                ...state,
                isProcessScreen: !state.isProcessScreen
            }
        case 'RESOLVE_CV':
            if (payload.length === 0) {
                alert("No resumes selected");
                return state;
            }

            state.cvInfos.Resumes = [];
            state.cvInfos.FilteredResumes = [];
            state.cvInfos.FailedDocs = [];
            state = {
                ...state,
                isProcessScreen: !state.isProcessScreen
            }

            for (let index = 0; index < payload.Successfuls.length; index++) {
                state.cvInfos.Resumes = [
                    ...state.cvInfos.Resumes,
                    {
                        Resume: {
                            UniqueKey: uuidv4(),
                            ...payload.Successfuls[index]
                        }
                    }
                ];
            }
            for (let index = 0; index < payload.Faileds.length; index++) {
                state.cvInfos.FailedDocs = [
                    ...state.cvInfos.FailedDocs,
                    {
                        UniqueKey: uuidv4(),
                        ...payload.Faileds[index]
                    }
                ];
            }
            clearInterval(window.processInterval);
            state.cvInfos.FilteredResumes = state.cvInfos.Resumes;
            return state;
        case 'ADD_SELECTED_PERSON':
            return {
                ...state,
                selectedPersons: {
                    Resumes: [
                        ...state.selectedPersons.Resumes,
                        state.cvInfos.Resumes.find(cv => cv.Resume.UniqueKey === payload)
                    ]
                }
            }
        case 'TOGGLE_FROMXML':
            return {
                ...state,
                fromXML: !state.fromXML
            }
        case 'FILTER_PERSONS':
            return {
                ...state,
                cvInfos: {
                    ...state.cvInfos,
                    FilteredResumes: [
                        ...state.cvInfos.Resumes.filter(cv => cv.Resume.DetailResume.toLocaleLowerCase().indexOf(payload) > -1)
                    ]
                }
            }
        case 'REMOVE_SELECTED_PERSON':
            return {
                ...state,
                selectedPersons: {
                    Resumes: [
                        ...state.selectedPersons.Resumes.filter(cv => cv.Resume.UniqueKey !== payload)
                    ]
                }
            }
        default:
            return state;
    }
}

export class ResumeProvider extends Component {
    state = {
        fromXML: false,
        isVisible: false,
        gridView: false,
        isProcessScreen: true,
        selectedPersons: { Resumes: [] },
        cvInfos: {
            FilteredResumes: [],
            Resumes: [],
            FailedDocs: []
        },
        dispatch: (action) => {
            this.setState(state => reducer(state, action));
        }
    };

    render() {
        return (
            <ResumeContext.Provider value={this.state}>
                {this.props.children}
            </ResumeContext.Provider>
        )
    }
}

const ResumeConsumer = ResumeContext.Consumer;
export default ResumeConsumer;