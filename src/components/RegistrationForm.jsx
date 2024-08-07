import React, { useState, useEffect } from "react";
import { HiUserAdd } from "react-icons/hi";
import CountryCodes from "./../countryCodes.json";
import { useNavigate } from "react-router-dom";
import Homebar from "./Homebar";
import { Modal, Button } from "react-bootstrap";
import { validateFormData } from "./../customScripts/registrationValidation.js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './../customStyles/toastifyStyles.css';
import axios from "axios";
import { encrypt } from "./Security";
import { generateCaptcha } from './../customScripts/captchaCodeGenerator.js';
import { LuRefreshCcw } from "react-icons/lu";
import CaptchaBG from "./../assets/images/bg1.jpg";

const RegistrationForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  //For params 
  const [fullName, setFullName] = useState("");
  const [fullEmail, setFullEmail] = useState("");
  //For captcha
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  useEffect(() => {
    setGeneratedCaptcha(generateCaptcha());
  }, []);
  const handleRefreshCaptcha = () => {
    setGeneratedCaptcha(generateCaptcha());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Update email and full name for params
    const email = `${formData.Email || ''}`;
    const newFullName = `${formData.first_name || ''} ${formData.middle_name || ''} ${formData.last_name || ''}`.trim();
    setFullName(newFullName);
    setFullEmail(email);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChecked) {
      setShowModal(true);
      return;
    }

    const validationErrors = validateFormData(formData, generatedCaptcha);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Data Invalid", {
        className: 'custom-toast-error'
      });
      console.log(formData)
    } else {
      setErrors({});

      // Show processing toast
      const processingToastId = toast.loading("Processing your registration...", {
        toastId: 'processingToast',
        theme: "colored",
        className: 'toastify-blue'
      });
      const {captcha , confirmEmail , ...apiData} = formData;
      try {
        const response = await axios.post("https://localhost:7142/api/Users", apiData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(formData);
        console.log("Form submitted successfully:", response);
        if (response.data) {
          toast.update(processingToastId, {
            render: "Registration Successful",
            type: "success",
            autoClose: 5000,
            className: 'toastify-success'
          });
          // navigate("/registration-complete");
          // For params
          const enName = encrypt(fullName);
          const enEmail = encrypt(fullEmail);
          navigate(`/registration-complete/${enName}/${enEmail}`);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        if (error.response) {
          console.log("Error data:", error.response.data);
          console.log("Error status:", error.response.status);
          console.log("Error headers:", error.response.headers);
          const serverErrors = error.response.data.errors;
          if (serverErrors) {
            Object.keys(serverErrors).forEach((field) => {
              toast.error(`${field}: ${serverErrors[field].join(', ')}`, {
                className: 'custom-toast-error'
              });
            });
          }
        }
        // Dismiss the processing toast
        toast.dismiss(processingToastId);

        // Show a new error toast
        toast.error(`Error: ${error.response?.data?.title || 'Email already registered'}`, {
          className: 'custom-toast-error',
          closeButton: true
        });
      }
    }
  }
  const handleReset = () => {
    setFormData({});
    setIsChecked(false);
    setErrors({});
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
        theme="colored" // Set to "light", "dark", or "colored"
      />


      <div className="mb-5">
        <div className="mb-5">
          <div className="container mt-4">
            <div className="card border border-black">
              <div
                className="card-header text-light fs-5 d-flex align-items-center"
                style={{ backgroundColor: "#005174" }}
              >
                <HiUserAdd color="" size="30px" className="me-2" />
                New user Registration
              </div>
              <div className="card-body">
                <h5 className="card-title text-danger mb-3 text-center">
                  All communication related to your applications will be sent to
                  this Email id. Account Activation link will be sent to this
                  Email Id.<br />
                  All fields marked with (*) are required.
                </h5>
                <form onSubmit={handleSubmit}>
                  {/* Email IDs */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="Email" className="form-label fw-bold">
                        Email ID <span className="text-danger ">*</span>
                      </label>
                      <input
                        placeholder="Enter Email ID"
                        type="Email"
                        className={`form-control border-dark ${errors.Email ? "is-invalid" : ""}`}
                        id="Email"
                        name="Email"
                        aria-describedby="EmailHelp"
                        value={formData.Email || ""}
                        onChange={handleChange}
                      />
                      {errors.Email && (
                        <div className="invalid-feedback">{errors.Email}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="confirmEmail"
                        className="form-label fw-bold"
                      >
                        Confirm Email ID <span className="text-danger ">*</span>
                      </label>
                      <input
                        placeholder="Enter Email ID"
                        type="Email"
                        className={`form-control border-dark ${errors.confirmEmail ? "is-invalid" : ""}`}
                        id="confirmEmail"
                        name="confirmEmail"
                        aria-describedby="EmailHelp"
                        value={formData.confirmEmail || ""}
                        onChange={handleChange}
                        onPaste={(e) => e.preventDefault()}
                        autoComplete="off"
                      />
                      {errors.confirmEmail && (
                        <div className="invalid-feedback">
                          {errors.confirmEmail}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Names */}
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label htmlFor="first_name" className="form-label fw-bold">
                        First Name <span className="text-danger ">*</span>
                      </label>
                      <input
                        placeholder="Enter First Name"
                        type="text"
                        className={`form-control border-dark ${errors.first_name ? "is-invalid" : ""}`}
                        id="first_name"
                        name="first_name"
                        value={formData.first_name || ""}
                        onChange={handleChange}
                      />
                      {errors.first_name && (
                        <div className="invalid-feedback">
                          {errors.first_name}
                        </div>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label
                        htmlFor="middle_name"
                        className="form-label fw-bold"
                      >
                        Middle Name
                      </label>
                      <input
                        placeholder="Enter Middle Name"
                        type="text"
                        className="form-control border-dark"
                        id="middle_name"
                        name="middle_name"
                        value={formData.middle_name || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="last_name" className="form-label fw-bold">
                        Last Name
                      </label>
                      <input
                        placeholder="Enter Last Name"
                        type="text"
                        className="form-control border-dark"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Parents' Names */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label
                        htmlFor="Fathers_name"
                        className="form-label fw-bold"
                      >
                        Father's Name <span className="text-danger ">*</span>
                      </label>
                      <input
                        placeholder="Enter Father's Name"
                        type="text"
                        className={`form-control border-dark ${errors.fathers_name ? "is-invalid" : ""}`}
                        id="fathers_name"
                        name="fathers_name"
                        value={formData.fathers_name || ""}
                        onChange={handleChange}
                      />
                      {errors.fathers_name && (
                        <div className="invalid-feedback">
                          {errors.fathers_name}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="mothers_name"
                        className="form-label fw-bold"
                      >
                        Mother's Name <span className="text-danger ">*</span>
                      </label>
                      <input
                        placeholder="Enter Mother's Name"
                        type="text"
                        className={`form-control border-dark ${errors.mothers_name ? "is-invalid" : ""}`}
                        id="mothers_name"
                        name="mothers_name"
                        value={formData.mothers_name || ""}
                        onChange={handleChange}
                      />
                      {errors.mothers_name && (
                        <div className="invalid-feedback">
                          {errors.mothers_name}
                        </div>
                      )}
                    </div>
                  </div>


                  {/* Mobile Numbers */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="mobile_number" className="form-label fw-bold">
                        Mobile No. with Country Code <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <select
                          className="form-select border-dark"
                          name="country_code"
                          id="country_code"
                          value={formData.country_code || ""}
                          onChange={handleChange}
                        >
                          <option defaultValue>Code</option>
                          {CountryCodes.map((Country, index) => (
                            <option key={index} value={Country.value}>
                              {Country.label}
                            </option>
                          ))}
                        </select>
                        <input
                          placeholder="Enter Mobile Number"
                          style={{ width: "60%" }}
                          type="text"
                          className={`form-control border-dark ${errors.mobile_number ? "is-invalid" : ""}`}
                          id="mobile_number"
                          name="mobile_number"
                          value={formData.mobile_number || ""}
                          onChange={handleChange}
                        />
                        {errors.mobile_number && (
                          <div className="invalid-feedback">
                            {errors.mobile_number}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="Alternate_mobile_number" className="form-label fw-bold">
                        Alternate Mobile No. with Country Code <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <select
                          className="form-select border-dark"
                          name="alternate_Mb_Country_code"
                          value={formData.alternate_Mb_Country_code || ""}
                          onChange={handleChange}
                        >
                          <option defaultValue>Code</option>
                          {CountryCodes.map((country, index) => (
                            <option key={index} value={country.value}>
                              {country.label}
                            </option>
                          ))}
                        </select>
                        <input
                          style={{ width: "60%" }}
                          placeholder="Enter Alternate Mobile Number"
                          type="text"
                          className={`form-control border-dark ${errors.Alternate_mobile_number ? "is-invalid" : ""}`}
                          id="Alternate_mobile_number"
                          name="Alternate_mobile_number"
                          value={formData.Alternate_mobile_number || ""}
                          onChange={handleChange}
                        />
                        {errors.Alternate_mobile_number && (
                          <div className="invalid-feedback">
                            {errors.Alternate_mobile_number}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Captcha */}
                  <div className="mb-3 w-100">
                    <label htmlFor="captcha" className="form-label fw-bold">
                      Enter Captcha Code <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex flex-wrap align-items-center">
                      <div className="d-flex flex-column me-2">
                        <input
                          placeholder="Enter Captcha"
                          type="text"
                          className={`form-control border-dark ${errors.captcha ? "is-invalid" : ""}`}
                          id="captcha"
                          name="captcha"
                          style={{ width: "150px" }}
                          value={formData.captcha || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="captcha-code me-2">
                          <div
                            style={{ border: '2px solid black', padding: '5px', fontSize: '18px', userSelect: "none", letterSpacing: "5px", backgroundImage: `url(${CaptchaBG})` }}
                            className="text-dark poppins-bold rounded-3 d-inline"
                          >
                            <span style={{ color: "rgba(0,0,0,.7)" }}>
                              {generatedCaptcha}
                            </span>
                          </div>
                        </div>
                        <button type="button" className="btn btn-secondary btn-sm border-dark" onClick={handleRefreshCaptcha}>
                          <LuRefreshCcw size="25" />
                        </button>
                      </div>
                      {errors.captcha && (
                        <div className="invalid-feedback d-block ms-2">
                          {errors.captcha}
                        </div>
                      )}
                    </div>
                  </div>


                  {/* Checkbox and Buttons */}
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input border border-2"
                      id="exampleCheck1"
                      style={{ borderColor: "black" }}
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                    />
                    <label
                      className="form-check-label text-danger"
                      htmlFor="exampleCheck1"
                    >
                      I've checked all details filled in this page are correct.
                      These details will not be editable during filling up
                      application. I understand and agree with this.
                    </label>
                  </div>
                  <div className="btn-section d-flex flex-column align-items-center">
                    <div className="d-flex">
                      <button type="submit" className="btn btn-primary m-1 card-button">
                        Submit
                      </button>
                      <button type="button" className="btn btn-danger m-1 card-button" onClick={handleReset}>
                        Clear Form
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Checkbox Validation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Validation Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger">
            Please check the agreement checkbox before submitting the form.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => setShowModal(false)}
            className="btn-danger card-button"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="pb-5"></div>
    </>
  );
};

export default RegistrationForm;

