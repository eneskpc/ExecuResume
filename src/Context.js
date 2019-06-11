import React, { Component } from 'react';
import axios from 'axios';
import uuidv4 from 'uuid/v4';

const ResumeContext = React.createContext();

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = resolve(reader.result);
        reader.onerror = reject;
    });
}

const reducer = async (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'ADD_FILES':
            let tempCVFiles = [];
            for (let index = 0; index < payload.length; index++) {
                let result = await getBase64(payload[index]);
                result = result.substring(result.indexOf(',') + 1, result.length - 1);
                if (state.cvFiles.filter(file => file.file === result).length === 0) {
                    tempCVFiles = [
                        ...tempCVFiles,
                        {
                            key: uuidv4(),
                            file: result,
                            name: payload[index].name
                        }
                    ];
                }
            }
            return {
                ...state,
                cvFiles: [
                    ...state.cvFiles,
                    ...tempCVFiles
                ]
            }
        case 'DELETE_FILE':
            return {
                ...state,
                cvFiles: state.cvFiles.filter(file => file.key !== payload)
            }
        default:
            return state;
    }
}

export class ResumeProvider extends Component {
    state = {
        cvFiles: [],
        isVisible: false,
        cvInfos: [],
        dispatch: async (action) => {
            const x = await reducer(this.state, action);
            this.setState(state => x);
        }
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
                    this.state.cvInfos.push(response.data);
                    console.log(this.state.cvInfos[this.state.cvInfos.length - 1]);
                    if (i === this.state.cvFiles.length - 1)
                        this.setState({
                            isVisible: false
                        });
                });
            })(cvFiles[index], index);
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