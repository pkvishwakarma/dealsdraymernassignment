import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { HomeHeader } from "./homeHeader";
import { AdminSignin } from './AdminProfileData/adminSignin';
import { AdminRegistration } from './AdminProfileData/adminRegistration';
import { AdminHomeDashboard } from './adminHomeDashboard';
import { EmployeeCreateUpdateForm } from './EmployeeProfileData/createEmployee';
import { ModifyEmployeeInfoForm } from './EmployeeProfileData/modifyEmployeeInfo';

export function HomeIndex() {
    return (
        <>
            <div className='indexImgContainer'>
                <Routes>
                    <Route path='/' element={<HomeHeader display={'block'} />}>
                        <Route path='login' element={<AdminSignin />} />
                        <Route path='signup' element={<AdminRegistration />} />
                    </Route>
                    <Route path='/homepage' element={<AdminHomeDashboard />}>
                        <Route path='employeeform' element={<EmployeeCreateUpdateForm />} />
                    </Route>
                    <Route path='/modifyemployeeininfo/:email' element={<ModifyEmployeeInfoForm />} />
                    <Route path='*' element={<>
                    <div>Page Not Found</div>
                    <Link to={"/"}>Back to Home Page</Link>
                    </>} />
                </Routes>
            </div>
        </>
    )
}