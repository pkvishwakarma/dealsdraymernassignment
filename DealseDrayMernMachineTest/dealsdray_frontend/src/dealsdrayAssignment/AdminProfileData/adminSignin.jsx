import React, { useEffect, useState } from 'react';
import { TextField,Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from "yup";
import { RotatingLines } from 'react-loader-spinner';
import FilledInput from '@mui/material/FilledInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

function SetAdminVerifyToken(resToken){
    sessionStorage.setItem("token",resToken);
}

export function AdminSignin() {
    const navigate=useNavigate();
    const [errorMsg,setErrorMsg]=useState("");
    const [loadSpinner, setLoadSpinner] = useState(false);
    const [showPassword, setShowPassword] =useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const formData=useFormik({
        initialValues:{admin_name:"",password:""},
        validationSchema:yup.object({
         admin_name:yup.string().required('User Name required'),
         password:yup.string().required("Password is Required")   
        }),
        onSubmit:async(values)=>{
            setLoadSpinner(true);
           await axios.post("http://127.0.0.1:4000/admin/verifyadminlogin",values)
            .then(res=>{
                SetAdminVerifyToken(res.data.token);
                navigate("/homepage");
                setLoadSpinner(false);
            })
            .catch(error=>{
                setErrorMsg(JSON.parse(error.response.request.response).message);
                setLoadSpinner(false);
            })
        }
    })

    useEffect(()=>{
        if(sessionStorage.getItem("token")){
            navigate("/homepage");
            return;
        }
        else{
            navigate("/login");
            return;
        }
    },[navigate])

    return (
        <>
            <div className='registerFormContainer'>
                <div className="registerHeadingContainer"><span className="bi bi-person-fill me-2"></span><span>Login</span></div>
                <div style={{color:"red",textAlign:"center"}}>{errorMsg}</div>
                <div style={loadSpinner === false ? { display: 'none' } : { display: 'block',position:"absolute", left:"10em"}}>
                    <RotatingLines
                        visible={true}
                        width="96"
                        strokeColor="black"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                    />
                </div>
                <form className="registerForm" onSubmit={formData.handleSubmit}>
                    <div style={{ marginBottom: '1em' }}>
                        <TextField type="text" autoFocus variant="filled" name="admin_name" label="User Name" sx={{ width: '100%' }} onChange={formData.handleChange} />
                        {formData.errors.admin_name?<div className='text-danger'>{formData.errors.admin_name}</div>:<div></div>}
                    </div>
                    <div style={{ marginBottom: '1em' }}>
                        {/* <TextField type="password" variant="filled" name="password" label="Password" sx={{ width: '100%' }} onChange={formData.handleChange} /> */}
                        <FormControl variant="filled" sx={{ width: '100%' }}>
                            <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                                <FilledInput
                                    id="filled-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    onChange={formData.handleChange}
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
                        {formData.errors.password?<div className='text-danger'>{formData.errors.password}</div>:<div></div>}
                    </div>
                    <Button type="submit" variant="contained" sx={{ width: "100%", fontWeight: "550", textTransform: "capitalize" }}>Login</Button>
                    <div className="text-center mt-2">Are You New Here? <Link to={"/signup"} className="text-decoration-none">SignUp</Link></div>
                </form>
            </div>
        </>
    )
}