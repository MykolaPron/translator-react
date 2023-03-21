import React from "react";
import {Link} from "react-router-dom";
import {CPages} from "../../shared/constatns/CPages";

const Header = () => {
    return (
        <div>
            <h1>Translation App</h1>
            <ul style={{
                display: "flex",
                listStyle: "none",
                gap: "1rem",
                padding: "0 1rem"
            }}>
                {CPages.map(page => <li key={page.name}>
                    <Link to={page.link}>{page.name}</Link>
                </li>)}
            </ul>
        </div>
    )
}

export default Header
