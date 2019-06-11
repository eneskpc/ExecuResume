import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "jquery";
import "popper.js";
import 'bootstrap/dist/js/bootstrap.min';
import CVResolver from './components/CVResolver';
import Navbar from './components/Navbar';

class App extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="container mt-3">
          <div className="jumbotron">
            <h1 className="display-4">Try ExecuResume!</h1>
            <p className="lead">Choose a Resume Document (doc, docx, pdf)</p>
            <CVResolver />
          </div>
        </div>
      </div>
    );
  }
}

export default App;