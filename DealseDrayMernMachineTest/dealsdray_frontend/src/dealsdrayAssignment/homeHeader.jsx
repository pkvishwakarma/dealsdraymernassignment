import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export function HomeHeader(prop) {
    return (
        <>
            <header>
                <div className='headerContainer'>
                    <div>
                        <img src="./images/hrLogo.png" alt="logoImg" width={'80'} style={{ marginLeft: "1.9em", borderRadius: "50%" }} />
                        <div style={{ fontFamily: "Single Day", lineHeight: "2rem", fontSize: "1.8em", fontWeight: "600" }}>HumanResources</div>
                    </div>
                    <div style={{display:`${prop.display}`}}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Link to={'login'} style={{ textDecoration: "none", color: "black", marginRight: "1em", fontFamily: "Single Day", fontSize: "1.7em", cursor: "pointer" }}><div>Login</div></Link>
                            <Link to={'signup'} style={{ textDecoration: "none", color: "black", fontFamily: "Single Day", fontSize: "1.7em", cursor: "pointer" }}><div>SignUp</div></Link>
                        </div>
                    </div>
                </div>
            </header>
            <section style={{display:`${prop.display}`}}>
                <Outlet />
            </section>
        </>
    )
}