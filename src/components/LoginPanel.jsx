import React, { useState } from 'react';
import { FaUserLock } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Captcha1 from './../assets/captcha/captcha_1.png';
import { Link, useNavigate } from 'react-router-dom';
import Homebar from './Homebar';
import { validateLoginForm } from './../customScripts/loginValidations.js';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import "./../customStyles/buttonAnimation.css";
import 'react-toastify/dist/ReactToastify.css';
import './../customStyles/toastifyStyles.css';//also contains the animation for eye icon in password input

const LoginPanel = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        captcha: ''
    });

    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateLoginForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            try {
                const response = await axios.post('https://localhost:7142/api/Login', formData);
                if (response.status === 200) {
                    navigate('/user/applicationlist'); 
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        toast.error('Invalid email or password');
                    } else if (error.response.status === 404) {
                        toast.error('User not found');
                    } else {
                        toast.error('An error occurred. Please try again.');
                    }
                } else if (error.request) {
                    toast.error('No response from server');
                } else {
                    toast.error('An error occurred: ' + error.message);
                }
            }
        }
    };

    return (
        <>
            <Homebar />
            <ToastContainer
                position="top-right"
                autoClose={15000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />
            <div className='container d-flex justify-content-center align-items-center mt-5 pb-5'>
                <div className="pb-5"></div>
                <div className='col-12 col-md-6 col-lg-4 border rounded-2 card'>
                    <div className="card-header text-light" style={{ backgroundColor: '#005174' }}>
                        <FaUserLock size={25} style={{ marginRight: '8px' }} />
                        User Login
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="m-3">
                            <label htmlFor="email" className="form-label">Email ID</label>
                            <input
                                placeholder="Username"
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="m-3 position-relative">
                            <label htmlFor="password" className="form-label">Password (Case Sensitive)</label>
                            <div className="password-container">
                                <input
                                    placeholder="Password"
                                    type={passwordVisible ? 'text' : 'password'}
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <span
                                    className="password-icon"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                                >
                                    {passwordVisible ?  <AiOutlineEye /> : <AiOutlineEyeInvisible /> }
                                </span>
                            </div>
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>
                        <div className="m-3 d-flex justify-content-between align-items-end">
                            <div className="captcha-field">
                                <label htmlFor="captcha" className="form-label">Captcha Code</label>
                                <input
                                    placeholder="Enter Captcha"
                                    type="text"
                                    className={`form-control ${errors.captcha ? 'is-invalid' : ''}`}
                                    id="captcha"
                                    name="captcha"
                                    value={formData.captcha}
                                    onChange={handleChange}
                                />
                                {errors.captcha && <div className="invalid-feedback">{errors.captcha}</div>}
                            </div>
                            <div className="captcha-code">
                                <img src={Captcha1} alt="Captcha Code" style={{ border: '2px solid black' }} />
                            </div>
                        </div>
                        <div className='m-3 d-flex justify-content-between align-items-center'>
                            <Link to="/forgot-password">Forgot Password?</Link>
                            <Link to="/">Back To Home</Link>
                            <button type="submit" className="btn btn-primary card-button">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="pb-5"></div>
        </>
    );
};

export default LoginPanel;
