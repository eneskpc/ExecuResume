import React from 'react'

export default function Navbar() {
    return (
        <div className="container mt-4">
            <nav className="navbar navbar-expand-lg navbar-light rounded border bg-white">
                <div className="d-flex justify-content-between align-items-center w-100">
                    <a className="navbar-brand" href="/">
                        <img src="http://dev.execuselect.com/Resources/images/logo.png" alt="eXecuSelect, aday veritabanı ve işe alım sistemi" width="250" />
                    </a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#toggle-menu" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
                <div className="collapse navbar-collapse" id="toggle-menu">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <a className="nav-link text-right text-nowrap" href="/">Ana Sayfa <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-right text-nowrap" href="/">Dokümantasyon</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}
