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
        <header className="container-fluid bg1 py-3 px-3 ps-sm-5">
            <div className="row">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="col-7 col-md-4 col-lg-3 col-xl-2">
                        <img className="ms-md-4 w-100" src={logo} alt="Prefeitura Municipal de Parobé"/>    
                    </div>
                    <a href="/link" className={`ho1 a text-danger fs-3 me-sm-5 ${history}`}  onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                        <i className="bi bi-box-arrow-left"></i>
                    </a>
                    <a href={back} className={`ho1 a text-danger fs-3 me-sm-5 ${login}`}>
                        <i className="bi bi-box-arrow-left"></i>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default Header;