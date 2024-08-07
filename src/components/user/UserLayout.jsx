import React from 'react'
import Sidebar from './Sidebar'
import Footer from './../Footer';
import { Outlet } from 'react-router-dom';
import "./../../customStyles/buttonAnimation.css";
import AfterLoginTopBar from './LogoutBar';

const LayoutCompo = () => {
    return (
        <div>
            <AfterLoginTopBar />
            <div className="d-flex">
                <Sidebar />
                <div style={{ marginLeft: '', padding: '20px', marginTop: '', width: '', paddingBottom: '1100px' }}>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LayoutCompo;
