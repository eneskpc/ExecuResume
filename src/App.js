import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "jquery";
import "popper.js";
import 'bootstrap/dist/js/bootstrap.min';
import React from 'react';
import CVResolver from './components/CVResolver';
import Navbar from './components/Navbar';
import CVInfoShower from './components/CVInfoShower';
import ResumeConsumer from './Context';

class App extends React.Component {
  state = {
    process: {
      loadedByte: 0,
      totalByte: 0
    }
  };



  render() {
    return (
      <ResumeConsumer>
        {
          value => {
            const { isVisible } = value;
            return (
              <div>
                <Navbar />
                <div className={'container mt-3' + (isVisible ? ' loading-box' : '')}>
                  <div className="jumbotron" >
                    <h1 className="display-4">Try ExecuResume!</h1>
                    <p className="lead">Choose a Resume Document (doc, docx, pdf)</p>
                    <CVResolver />
                  </div>
                </div>
                <CVInfoShower />
              </div>
            )
          }
        }
      </ResumeConsumer>

    );
  }
}

export default App;