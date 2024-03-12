import React, { createContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { HomeHeader } from "./homeHeader";
import { ModifyEmployeeInfoForm } from "./EmployeeProfileData/modifyEmployeeInfo";

function GetAdminVerifyToken() {
    const getToken = sessionStorage.getItem("token");
    return getToken;
}

//useContext Example..
const empContext = createContext();
export { empContext };
//useContext End..

export function AdminHomeDashboard() {
    const navigate = useNavigate();
    const adminToken = GetAdminVerifyToken();
    const [adminName, setAdminName] = useState("");
    const [employeeList, setEmployeeList] = useState([]);
    const [employeeListFiltered, setEmployeeListFiltered] = useState([]);
    const [tableDisplay, setTableDisplay] = useState(false);
    const [tblToggle, setTblToggle] = useState(false);
    const [modifyFormDisplay, setModifyFormDisplay] = useState(false);
    const [modifyEmailId, setModifyEmailId] = useState("");

    function HandleEmployeeList() {
        axios.get("http://127.0.0.1:4000/admin/employeedata")
            .then((res) => {
                // console.log(res.data);
                setEmployeeList(res.data);
                // setTableDisplay((bool) => !bool);
                setTableDisplay(true);
                setTblToggle(false);
            })
    }

    function HandleNameWiseSearch(e) {
        if (e.target.value) {
            axios.get("http://127.0.0.1:4000/admin/employeedata")
                .then((res) => {
                    // console.log(res.data);
                    var result = res.data.filter((emp) => {
                        return emp.employee_name.includes(e.target.value);
                    })
                    setEmployeeListFiltered(result);
                })
        }
        else {
            setEmployeeListFiltered([]);
        }
    }

    function HandleDeleteEmployeeData(emailid) {
        var flag = window.confirm("Are You Sure /n You Want to Delete ");
        if (flag) {
            axios.delete(`http://127.0.0.1:4000/admin/removeemployeedata/${emailid}`)
            HandleEmployeeList();
            navigate("/login");
        }

    }

    useEffect(() => {
        if (!adminToken) {
            navigate("/login")
            return;
        }
        else {
            try {
                // axios.post("http://127.0.0.1:4000/admin/getadmindatausingtoken",{headers:{"token":adminToken}})  (not Working in that way)..

                axios({ method: 'post', url: "http://127.0.0.1:4000/admin/getadmindatausingtoken", headers: { 'token': adminToken } })
                    .then((res) => {
                        setAdminName(res.data.admin_name);
                    })
            } catch (error) {
                console.log(error);
            }
        }
    }, [adminToken, navigate]);
    return (
        <>
            <div style={{ backgroundColor: "rgba(0,0,0,0.2)", minHeight: "100vh", maxHeight: "max-content" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div onClick={() => { navigate("/") }} style={{ cursor: "pointer" }}>
                        <HomeHeader display={'none'} />
                    </div>
                    <div style={{ display: "flex" }}>
                        <div style={{ color: "black", fontSize: "1.3em", fontWeight: "600", marginRight: "1em", cursor: "pointer" }} onClick={HandleEmployeeList}>Employee List</div>
                        <div onClick={()=>{setTableDisplay(false);setTblToggle(true)}}>
                            <Link to={"employeeform"} style={{ textDecoration: "none" }}>
                                <div style={{ color: "black", fontSize: "1.3em", fontWeight: "600", marginRight: "1em", cursor: "pointer" }}>Create Employee</div>
                            </Link>
                        </div>
                    </div>
                    <div style={{ display: "flex", marginRight: "2em" }}>
                        <div style={{ color: "green", fontSize: "1.5em", fontWeight: "bold", textTransform: "capitalize", marginRight: "1em" }}>Welcome - {adminName}</div>
                        <button type='button' onClick={() => { sessionStorage.removeItem("token"); navigate("/login"); }} style={{ backgroundColor: "yellow", padding: "0.5em 1.4em", borderRadius: "2em", border: "none", fontWeight: "bold" }}>Logout</button>
                    </div>
                </div>
                <div style={{ fontSize: "2em", fontWeight: "620" }}>
                    Welcome to Admin Dashboard
                </div>
                <div style={tblToggle === true ? { display: "block" } : { display: "none" }}>
                    <Outlet />
                </div>
                <div className='employeeListContainer' style={tableDisplay === true ? { display: "block", margin: "0 1em" } : { display: "none"}}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "right", marginBottom: "-3em" }}>
                            <div style={{ fontSize: "1.2em", fontWeight: "600", marginRight: "1em" }}>Total Count-{employeeList.length}</div>
                            <div>
                                <label htmlFor="search" className="form-label fw-bold ms-2">Search</label>
                                <input type="text" placeholder="Enter Search Keyword" name='search' className="form-control" onKeyUp={HandleNameWiseSearch} />
                            </div>
                        </div>
                        <table className="table table-secondary caption-top">
                            <caption className="fs-3 fw-bold text-dark">Employee List</caption>
                            <thead>
                                <tr>
                                    <th>Unique Id</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Mobile No</th>
                                    <th>Designation</th>
                                    <th>Gender</th>
                                    <th>Course</th>
                                    <th>Create Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeListFiltered.length === 0 ? employeeList.map((emp) => (
                                    <tr key={emp.employee_id}>
                                        <td>{emp.employee_id}</td>
                                        <td><img src={`http://localhost:4000/profileImage/${emp.profileimg}`} alt="ProfileImage" width={"50"} /></td>
                                        <td>{emp.employee_name}</td>
                                        <td><a href={`mailto:${emp.email}`}>{emp.email}</a></td>
                                        <td>{emp.mobile.substring(emp.mobile.indexOf("1") + 1)}</td>
                                        <td>{emp.designation.toUpperCase()}</td>
                                        <td>{emp.gender.toUpperCase()}</td>
                                        <td>{emp.course.toUpperCase()}</td>
                                        <td>{emp.createdate.toUpperCase()}</td>
                                        <td><button type="button" className="btn btn-warning me-2" onClick={() => { setModifyEmailId(emp.email); setModifyFormDisplay(true) }}><span className="bi bi-pen-fill"></span></button><button type="button" className="btn btn-danger" onClick={() => { HandleDeleteEmployeeData(emp.email) }}><span className="bi bi-trash"></span></button></td>
                                    </tr>
                                )) : employeeListFiltered.map((emp) => (
                                    <tr key={emp.employee_id}>
                                        <td>{emp.employee_id}</td>
                                        <td><img src={`http://localhost:4000/profileImage/${emp.profileimg}`} alt="ProfileImage" width={"50"} /></td>
                                        <td>{emp.employee_name}</td>
                                        <td><a href={`mailto:${emp.email}`}>{emp.email}</a></td>
                                        <td>{emp.mobile.substring(emp.mobile.indexOf("1") + 1)}</td>
                                        <td>{emp.designation.toUpperCase()}</td>
                                        <td>{emp.gender.toUpperCase()}</td>
                                        <td>{emp.course.toUpperCase()}</td>
                                        <td>{emp.createdate.toUpperCase()}</td>
                                        <td><button type="button" className="btn btn-warning me-2" onClick={() => { setModifyEmailId(emp.email); setModifyFormDisplay(true);}}><span className="bi bi-pen-fill"></span></button><button type="button" className="btn btn-danger" onClick={() => { HandleDeleteEmployeeData(emp.email) }}><span className="bi bi-trash"></span></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={modifyFormDisplay === false ? { display: "none" } : { display: "block" }}>
                    <empContext.Provider value={modifyEmailId}>
                        <ModifyEmployeeInfoForm />
                    </empContext.Provider>
                </div>
            </div>
        </>
    )
}