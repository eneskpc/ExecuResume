import React, { Component } from 'react';
import uuidv4 from 'uuid/v4';

const ResumeContext = React.createContext();
const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'TOGGLE_VISIBLE':
            return {
                ...state,
                isVisible: !state.isVisible
            }
        case 'RESOLVE_CV':
            state = {
                ...state,
                cvInfos: []
            };

            for (let index = 0; index < payload.length; index++) {
                state.cvInfos = [
                    ...state.cvInfos,
                    {
                        UniqueKey: uuidv4(),
                        ...payload[index]
                    }
                ];
            }

            if (state.cvInfos.length > 0) {
                state = {
                    ...state,
                    selectedPerson: state.cvInfos[0],
                }
            }
            return state;
        case 'CHANGE_SELECTED_PERSON_KEY':
            return {
                ...state,
                selectedPerson: state.cvInfos.find(cv => cv.UniqueKey === payload)
            }
        default:
            return state;
    }
}

export class ResumeProvider extends Component {
    state = {
        isVisible: false,
        selectedPerson: null,
        cvInfos: [],
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