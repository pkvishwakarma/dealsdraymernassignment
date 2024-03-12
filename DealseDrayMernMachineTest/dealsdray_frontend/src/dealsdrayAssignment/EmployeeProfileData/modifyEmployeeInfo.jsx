import React, { useCallback, useContext, useEffect, useState } from 'react';
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
import { empContext } from '../adminHomeDashboard';



export function ModifyEmployeeInfoForm() {
    const navigate = useNavigate();
    const [createEmployeeErrorMsg, setCreateEmployeeErrorMsg] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [emailMatch, setEmailMatch] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [modifyEmployeeData, setModifyEmployeeData] = useState("");
    const [profileImgBtn,setProfileImgBtn]=useState(false);

    var emailId = useContext(empContext);

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
                if (response.data === "Email Verified") {
                    setEmailMsg("Email Verified")
                    setEmailMatch("");
                }
            })
            .catch((error) => {
                if (error.response.data === "This EmailId is Already Registred") {
                    setEmailMsg("")
                    setEmailMatch("This EmailId is Already Registred");
                }
            })
    }

    function HandleVerifyEmployeeEmailMsg() {
        setEmailMatch("");
    }

    var uploadFunction=useCallback(()=>{
        if (emailId) {
            axios.get(`http://127.0.0.1:4000/admin/emailwiseemployeeinfo/${emailId}`)
                .then((res) => {
                    setModifyEmployeeData(res.data);
                })
        }
    },[emailId])

    useEffect(() => {
        uploadFunction();
    }, [uploadFunction])

    const modifyFormik = useFormik({
        initialValues: ({
            employee_name: modifyEmployeeData.employee_name?modifyEmployeeData.employee_name:"",
            email: modifyEmployeeData.email?modifyEmployeeData.email:"",
            mobile: modifyEmployeeData.mobile?modifyEmployeeData.mobile:"",
            designation:modifyEmployeeData.designation?modifyEmployeeData.designation:"",
            gender: modifyEmployeeData.gender?modifyEmployeeData.gender:"",
            course: modifyEmployeeData.course?modifyEmployeeData.course.split(","):"",
            profileimg: modifyEmployeeData.profileimg?modifyEmployeeData.profileimg:"",
        }),
        enableReinitialize: true,
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
            axios.put(`http://127.0.0.1:4000/admin/modifyemployeeinfo/${emailId}`, formData)
                .then((response) => {
                    navigate("/login");
                })
                .catch((error) => {
                    setCreateEmployeeErrorMsg('Invalid Input Field');
                })
        })
    })
    return (
        <>
            <div className="registerFormContainer">
                <div className="registerHeadingContainer"><span className="bi bi-person-add me-2"></span><span>Update Employee Info</span></div>
                <form className="registerForm" onSubmit={modifyFormik.handleSubmit} encType='multipart/form-data'>
                    <div style={{ color: "red" }}>{createEmployeeErrorMsg}</div>
                    <Box sx={{ width: '100%' }}>
                        <div style={{ marginBottom: '1em' }}>
                            <TextField type="text" onChange={modifyFormik.handleChange} variant="filled" name="employee_name" value={modifyFormik.values.employee_name} sx={{ width: '100%' }} />
                            {modifyFormik.errors.employee_name ? <div className="text-danger">{modifyFormik.errors.employee_name}</div> : <div></div>}
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <TextField type="text" onFocus={HandleVerifyEmployeeEmailMsg} onBlur={HandleVerifyEmployeeEmail} value={modifyFormik.values.email} onChange={modifyFormik.handleChange} variant="filled" name="email" sx={{ width: '100%' }} />
                            {modifyFormik.errors.email ? <div className="text-danger">{modifyFormik.errors.email}</div> : <div></div>}
                            <div style={{ color: "red" }}>{emailMatch} <span style={{ color: "green" }}>{emailMsg}</span></div>
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <TextField type="text" onFocus={() => { modifyFormik.setFieldValue("mobile", "+91") }} onChange={modifyFormik.handleChange} value={modifyFormik.values.mobile} variant="filled" name="mobile" sx={{ width: '100%' }} />
                            {modifyFormik.errors.mobile ? <div className="text-danger">{modifyFormik.errors.mobile}</div> : <div></div>}
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <FormControl variant="filled" sx={{ width: '100%' }}>
                                <InputLabel id="demo-simple-select-filled-label">Designation</InputLabel>
                                <Select
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    value={modifyFormik.values.designation}
                                    name="designation"
                                    onChange={modifyFormik.handleChange}
                                >
                                    <MenuItem value={"hr"}>HR</MenuItem>
                                    <MenuItem value={"manager"}>Manager</MenuItem>
                                    <MenuItem value={"sales"}>Sales</MenuItem>
                                </Select>
                            </FormControl>
                            {modifyFormik.errors.designation ? <div className="text-danger">{modifyFormik.errors.designation}</div> : <div></div>}
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                name="radio-buttons-group"
                                value={modifyFormik.values.gender}
                            >
                                <div>
                                    <FormControlLabel value="female" name='gender' control={<Radio />} onChange={modifyFormik.handleChange} label="Female" />
                                    <FormControlLabel value="male" name='gender' control={<Radio />} onChange={modifyFormik.handleChange} label="Male" />
                                    <FormControlLabel value="other" name='gender' control={<Radio />} onChange={modifyFormik.handleChange} label="Other" />
                                </div>
                            </RadioGroup>
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <FormLabel id="demo-radio-buttons-group-label">Course</FormLabel>
                            <FormGroup>
                                <div>
                                    <FormControlLabel value={"mca"} name='course' control={<Checkbox checked={modifyFormik.values.course.includes("mca")?true:false} />} onChange={modifyFormik.handleChange} label="MCA" />
                                    <FormControlLabel value={"bca"} name='course' control={<Checkbox checked={modifyFormik.values.course.includes("bca")?true:false} />} onChange={modifyFormik.handleChange} label="BCA" />
                                    <FormControlLabel value={"bsc"} name='course' control={<Checkbox checked={modifyFormik.values.course.includes("bsc")?true:false} />} onChange={modifyFormik.handleChange} label="BSC" />
                                </div>
                            </FormGroup>
                        </div>  
                        <div style={{display:"flex",marginBottom:"1em"}}>
                            <img style={profileImgBtn===false?{ visibility:"visible"}:{visibility:"hidden"}} src={`http://127.0.0.1:4000/profileImage/${modifyFormik.values.profileimg}`} alt="profilepic" width={100} />
                            <button type='button' className='bi bi-pen-fill btn btn-warning ms-4' onClick={()=>{setProfileImgBtn(bool=>!bool)}}></button>
                        </div>
                        <div style={profileImgBtn===true?{ display:"block", marginBottom: '1em' }:{display:"none"}}>
                            <TextField type="file" onChange={(event) => { modifyFormik.setFieldValue("profileimg", event.currentTarget.files[0]); var imgExtention=event.currentTarget.files[0].name.substring(event.currentTarget.files[0].name.lastIndexOf(".")+1);
                            if(imgExtention==="jpg" || imgExtention==="png" || imgExtention==="jpeg"){setBtnDisabled(false)}else{setBtnDisabled(true)}
                        }} name="profileimg" sx={{ width: '100%' }} />
                        {btnDisabled===true?<div style={{color:"red"}}>Please Select (jpg,png,jpeg) file Only</div>:<div></div>}
                        </div>
                        <Button type="submit" disabled={btnDisabled} variant="contained" sx={{ width: "100%", fontWeight: "550", textTransform: "capitalize" }}>Update</Button>
                        <Link to={"/login"}>
                            <Button type="button" variant="contained" sx={{ width: "100%", fontWeight: "550", textTransform: "capitalize", marginTop: "1em" }}>Cancle</Button>
                        </Link>
                    </Box>
                </form>
            </div>
        </>
    )
}