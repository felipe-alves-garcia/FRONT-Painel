import logo from "../assets/img/logo2.png";
import { useEffect, useState } from "react";

function Header (props){
    const [ back, setBack ] = useState("");
    const [ history, setHistory ] = useState("d-none");
    const [ login, setLogin ] = useState("d-inline");

    useEffect(() => {
        setBack(props.back);
        if (props.back === "link"){
            setHistory("d-inline");
            setLogin("d-none")
        }
    }, [props.back])

    return (
        <header className="container-fluid bg1 py-3 ps-5">
            <div className="row">
                <div className="d-flex justify-content-between align-items-center">
                    <a href="/admin/home" className="ho1">
                        <img className="ms-4" src={logo} alt="Prefeitura Municipal de Parobé"/>    
                    </a>
                    <a href="/link" className={`ho1 a text-danger fs-3 me-5 ${history}`}  onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                        <i className="bi bi-box-arrow-left"></i>
                    </a>
                    <a href={back} className={`ho1 a text-danger fs-3 me-5 ${login}`}>
                        <i className="bi bi-box-arrow-left"></i>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default Header;