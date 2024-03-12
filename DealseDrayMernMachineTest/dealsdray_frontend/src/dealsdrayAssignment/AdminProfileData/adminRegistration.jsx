import React, { useState } from 'react';
import './adminRegisterStyle.css';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FilledInput from '@mui/material/FilledInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';


export function AdminRegistration() {
    const navigate = useNavigate();
    const [registerErrorMsg, setRegisterErrorMsg] = useState('');
    const [adminnameMsg, setAdminnameMsg] = useState('');
    const [adminnameMatch, setAdminnameMatch] = useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // Verify Admin_id on Blur Event using POST Method..
    function HandleVerifyRegisterAdminName(e) {
        var adminData = {
            admin_name: e.target.value
        }
        if (e.target.value === '') {
            return;
        }
        axios.post("http://127.0.0.1:4000/admin/verifyregister", adminData)
            .then((response) => {
                if (response.data === "Admin Name Available") {
                    setAdminnameMatch("");
                    setAdminnameMsg(response.data);
                }
                else {
                    setAdminnameMatch("Admin Name Already Exist Please Use This");
                    setAdminnameMsg(response.data);
                }

            })
            .catch((error) => {
                console.log(error);
            })
    }

    function HandleVerifyRegisterAdminNameMsg() {
        setAdminnameMatch("");
        setAdminnameMsg("");
    }

    function HandleSuggestedAdminName(msg) {
        formik.setFieldValue("admin_name", msg);
    }

    const formik = useFormik({
        initialValues: ({
            admin_name: '',
            password: ''
        }),
        validationSchema: yup.object({
            admin_name: yup.string().required('User name required'),
            password: yup.string().required('Password required').min(4, 'Length is too short').matches(/[A-Z]{1}[a-z0-9]{3,8}[@#$%&]{1}[a-z0-9]{1,}/, 'Password must contain one UpperCase,LowerCase,Number,Special Charactor,lowercase or number').max(15, 'Length 15 Charactors Only')
        }),
        onSubmit: ((values) => {
            axios.post("http://127.0.0.1:4000/admin/registeradmin", values)
                .then((response) => {
                    navigate("/login");
                })
                .catch((error) => {
                    setRegisterErrorMsg('Invalid Input Field');
                })
        })
    })
    return (
        <>
            <div className="registerFormContainer">
                <div className="registerHeadingContainer"><span className="bi bi-person-add me-2"></span><span>Registration Form</span></div>
                <form className="registerForm" onSubmit={formik.handleSubmit} encType='multipart/form-data'>
                    <div style={{ color: "red" }}>{registerErrorMsg}</div>
                    <Box sx={{ width: '100%' }}>
                        <div style={{ marginBottom: '1em' }}>
                            <TextField type="text" onFocus={HandleVerifyRegisterAdminNameMsg} onBlur={HandleVerifyRegisterAdminName} autoFocus onChange={formik.handleChange} value={formik.values.admin_name} variant="filled" name="admin_name" label="User Name" sx={{ width: '100%' }} />
                            {formik.errors.admin_name ? <div className="text-danger">{formik.errors.admin_name}</div> : <div></div>}
                            <div style={{ color: "red" }}>{adminnameMatch} <span onClick={() => { HandleSuggestedAdminName(adminnameMsg) }} style={{ color: "green", cursor: "pointer" }}>{adminnameMsg}</span></div>
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <FormControl variant="filled" sx={{ width: '100%' }}>
                            <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                                <FilledInput
                                    id="filled-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    onChange={formik.handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {formik.errors.password ? <div className="text-danger">{formik.errors.password}</div> : <div></div>}
                        </div>
                        <Button type="submit" variant="contained" sx={{ width: "100%", fontWeight: "550", textTransform: "capitalize" }}>Create Account</Button>
                        <div className="text-center mt-2">Already Have an Account? <Link to={"/login"} className="text-decoration-none">LogIn</Link></div>
                    </Box>
                </form>
            </div>
        </>
    )
}