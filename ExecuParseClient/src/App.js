import "@fortawesome/fontawesome-free/scss/fontawesome.scss";
import "@fortawesome/fontawesome-free/scss/brands.scss";
import "@fortawesome/fontawesome-free/scss/solid.scss";
import "@fortawesome/fontawesome-free/scss/regular.scss";
import './App.scss';
import "jquery";
import "popper.js";
import 'bootstrap/dist/js/bootstrap.min';
import React from 'react';
import CVResolver from './components/CVResolver';
import Navbar from './components/Navbar';
import CVInfoShower from './components/CVInfoShower';
import ResumeConsumer from './Context';
import CVInfoShowerByGrid from "./components/CVInfoShowerByGrid";
import CVReaderFromXML from "./components/CVReaderFromXML";

class App extends React.Component {
  onToggleProcess = (dispatch) => {
    dispatch({
      type: 'TOGGLE_PROCESS_SCREEN',
      payload: true
    });
  }

  onToggleGridView = (dispatch) => {
    dispatch({
      type: 'TOGGLE_GRID',
      payload: true
    });
  }

  onToggleFromXML = (dispatch) => {
    dispatch({
      type: 'TOGGLE_FROMXML',
      payload: true
    });
  }

  onChangeSearch = (dispatch, e) => {
    dispatch({
      type: 'FILTER_PERSONS',
      payload: e.target.value
    });
  }

  render() {
    return (
      <ResumeConsumer>
        {
          value => {
            const { isVisible, isProcessScreen, cvInfos, dispatch, gridView, fromXML } = value;
            return (
              <div>
                <Navbar />
                <div className={'container mt-3 mb-4' + (cvInfos.Resumes.length > 0 ? ' d-flex justify-content-between align-items-center' : ' d-none')}>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-outline-primary" disabled={!gridView} onClick={this.onToggleGridView.bind(this, dispatch)}>
                      <i className="fas fa-border-all"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-primary" disabled={gridView} onClick={this.onToggleGridView.bind(this, dispatch)}>
                      <i className="fas fa-th-list"></i>
                    </button>
                  </div>
                  <div className="person-search w-100 mx-md-5 mx-2">
                    <input type="text" className="form-control form-control-sm" placeholder="Özgeçmişlerin içinde ara..." onChange={this.onChangeSearch.bind(this, dispatch)} />
                    <i className="fas fa-search"></i>
                  </div>
                  <button id="process-toggle" onClick={this.onToggleProcess.bind(this, dispatch)} className="btn btn-primary btn-sm text-nowrap">Ana Ekranı Göster</button>
                </div>
                <div className={'container mt-3' + (!isProcessScreen ? ' d-none ' : '') + (cvInfos.Resumes.length > 0 && !isProcessScreen ? ' d-none ' : '') + (isVisible ? ' loading-box' : '')}>
                  <div className={'jumbotron'} >
                    <h1 className="display-5">ExecuSelect CV Okuma Robotu!</h1>
                    <p className="lead">CV(ler) Seçiniz (doc, docx, pdf)</p>
                    <div className="text-right">
                      <div className="custom-control custom-switch">
                        <input type="checkbox" className="custom-control-input" id="fromXMLSwitch" checked={fromXML} onChange={this.onToggleFromXML.bind(this, dispatch)} />
                        <label className="custom-control-label" htmlFor="fromXMLSwitch">XML'den Aktar</label>
                      </div>
                    </div>
                    <CVResolver />
                    <CVReaderFromXML />
                  </div>
                </div>
                <CVInfoShower />
                <CVInfoShowerByGrid />
              </div>
            )
          }
        }
      </ResumeConsumer>

    );
  }
}

export default App;