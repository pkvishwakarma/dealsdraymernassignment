import React, { useState } from 'react';
import '../AdminProfileData/adminRegisterStyle.css';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';



export function EmployeeCreateUpdateForm() {
    const navigate = useNavigate();
    const [createEmployeeErrorMsg, setCreateEmployeeErrorMsg] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [emailMatch, setEmailMatch] = useState('');
    const [btnDisabled,setBtnDisabled]=useState(false);

    // Verify Email on Blur Event using POST Method..
    function HandleVerifyEmployeeEmail(e) {
        var employeeData = {
            email: e.target.value
        }
        if (e.target.value === '') {
            return;
        }
        axios.post("http://127.0.0.1:4000/admin/verifyemployeeemail", employeeData)
            .then((response) => {
                // console.log(response.data);
                if(response.data === "Email Verified") {
                    setEmailMsg("Email Verified")
                    setEmailMatch("");
                }
            })
            .catch((error) => {
                if(error.response.data ==="This EmailId is Already Registred"){
                    setEmailMsg("")
                    setEmailMatch("This EmailId is Already Registred");
                }
            })
    }

    function HandleVerifyEmployeeEmailMsg() {
        setEmailMatch("");
    }

    const formik = useFormik({
        initialValues: ({
            employee_name: '',
            email: '',
            mobile: '',
            designation: '',
            gender: '',
            course: '',
            profileimg: '',
        }),
        validationSchema: yup.object({
            employee_name: yup.string().required('Employee name required'),
            email: yup.string().required('Email Required').matches(/[a-z_#$&*@0-9]{1,}[@]{1}[a-z0-9]{1,}[.]{1}[a-z0-9]{1,}/, 'Invalid Email Address'),
            mobile: yup.string().required('Mobile No Required').matches(/\+91\d{10}/, 'Use +91 than 10 Digit Mob No').max(13, 'Invalid Mob no'),
            designation: yup.string().required('Designation required'),
            gender: yup.string().required('Gender required'),
        }),
        onSubmit: ((values) => {
            // console.log(values);
            var formData = new FormData();
            for (let value in values) {
                formData.append(value, values[value])
            }
            axios.post("http://127.0.0.1:4000/admin/createemployeedata", formData)
                .then((response) => {
                    navigate("/homepage");
                })
                .catch((error) => {
                    setCreateEmployeeErrorMsg('Invalid Input Field');
                })
        })
    })
    return (
        <>
            <div className="registerFormContainer">
                <div className="registerHeadingContainer"><span className="bi bi-person-add me-2"></span><span>Create Employee</span></div>
                <form className="registerForm" onSubmit={formik.handleSubmit} encType='multipart/form-data'>
                    <div style={{ color: "red" }}>{createEmployeeErrorMsg}</div>
                    <Box sx={{ width: '100%' }}>
                        <div style={{ marginBottom: '1em' }}>
                            <TextField type="text" onChange={formik.handleChange} variant="filled" name="employee_name" label="Employee Name" sx={{ width: '100%' }} />
                            {formik.errors.employee_name ? <div className="text-danger">{formik.errors.employee_name}</div> : <div></div>}
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <TextField type="text" onFocus={HandleVerifyEmployeeEmailMsg} onBlur={HandleVerifyEmployeeEmail} onChange={formik.handleChange} variant="filled" name="email" label="Email" sx={{ width: '100%' }} />
                            {formik.errors.email ? <div className="text-danger">{formik.errors.email}</div> : <div></div>}
                            <div style={{ color: "red" }}>{emailMatch} <span style={{ color: "green" }}>{emailMsg}</span></div>
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <TextField type="text" onFocus={() => { formik.setFieldValue("mobile", "+91") }} onChange={formik.handleChange} value={formik.values.mobile} variant="filled" name="mobile" label="Mobile" sx={{ width: '100%' }} />
                            {formik.errors.mobile ? <div className="text-danger">{formik.errors.mobile}</div> : <div></div>}
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <FormControl variant="filled" sx={{ width: '100%' }}>
                                <InputLabel id="demo-simple-select-filled-label">Designation</InputLabel>
                                <Select
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    name="designation"
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value={"hr"}>HR</MenuItem>
                                    <MenuItem value={"manager"}>Manager</MenuItem>
                                    <MenuItem value={"sales"}>Sales</MenuItem>
                                </Select>
                            </FormControl>
                            {formik.errors.designation ? <div className="text-danger">{formik.errors.designation}</div> : <div></div>}
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                            >
                                <div>
                                    <FormControlLabel value="female" name='gender' control={<Radio />} onChange={formik.handleChange} label="Female" />
                                    <FormControlLabel value="male" name='gender' control={<Radio />} onChange={formik.handleChange} label="Male" />
                                    <FormControlLabel value="other" name='gender' control={<Radio />} onChange={formik.handleChange} label="Other" />
                                </div>
                            </RadioGroup>
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <FormLabel id="demo-radio-buttons-group-label">Course</FormLabel>
                            <FormGroup>
                                <div>
                                    <FormControlLabel value={"mca"} name='course' control={<Checkbox />} onChange={formik.handleChange} label="MCA" />
                                    <FormControlLabel value={"bca"} name='course' control={<Checkbox />} onChange={formik.handleChange} label="BCA" />
                                    <FormControlLabel value={"bsc"} name='course' control={<Checkbox />} onChange={formik.handleChange} label="BSC" />
                                </div>
                            </FormGroup>
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <TextField type="file" onChange={(event) => { formik.setFieldValue("profileimg", event.currentTarget.files[0]); var imgExtention=event.currentTarget.files[0].name.substring(event.currentTarget.files[0].name.lastIndexOf(".")+1);
                            if(imgExtention==="jpg" || imgExtention==="png" || imgExtention==="jpeg"){setBtnDisabled(false)}else{setBtnDisabled(true)}
                        }} name="profileimg" sx={{ width: '100%' }} />
                        {btnDisabled===true?<div style={{color:"red"}}>Please Select (jpg,png,jpeg) file Only</div>:<div></div>}
                        </div>
                        <Button type="submit" disabled={btnDisabled} variant="contained" sx={{ width: "100%", fontWeight: "550", textTransform: "capitalize" }}>Create Employee</Button>
                        <Link to={"/homepage"}>
                            <Button type="button" variant="contained" sx={{ width: "100%", fontWeight: "550", textTransform: "capitalize", marginTop: "1em" }}>Cancle</Button>
                        </Link>
                    </Box>
                </form>
            </div>
        </>
    )
}