import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/img/logo1.png"

import Erro from "./Erro"

function Login (){
    const navigate = useNavigate();

    const [unidades, setUnidades] = useState([]);
    const url = "http://10.10.112.4:7002";
    const [ erros, setErros ] = useState([]);

    useEffect(() => {
        function dados (){
            axios.get(`${url}/unidades`).then((resp) => {
                if (resp.data.status)
                    setUnidades(resp.data.data);
                else{
                    setErros(resp.data.msg)
                }
            }).catch((error) => {
                setErros(["Erro ao listar unidades"])
                //console.log(error)
            })    
        } dados();
            

        const interval = setInterval(dados, 7000);

        return () => clearInterval(interval)
    }, [])

    //

    const [ unidade, setUnidade ] = useState("d-none");
    const [ name, setName ] = useState("");
    const [ id, setId ] = useState("");
    const [ login, setLogin ] = useState("");
    const [ password, setPassword ] = useState("");
    //const [ painel, setPainel ] = useState("d-block");

    function unidadeLogin (unidadeID, unidadeName){
        setUnidade("d-block");
        setName(unidadeName);
        setId(unidadeID);
        //(unidadeID === "admin") ? setPainel("d-none") : setPainel("d-block")
    }

    function funLogin(e){
        e.preventDefault();
        axios.get(`${url}/login/${id}/${login}/${password}`).then((resp) => {
            localStorage.setItem("user", JSON.stringify(resp.data.data));
            if (resp.data.status){
                if(resp.data.data.tipo === "admin")
                    navigate("/admin/home")
                if(resp.data.data.tipo === "triagem")
                    navigate("/triagem/unidade/"+id)
                if(resp.data.data.tipo === "atendimento")
                    navigate("/atendimento/unidade/"+id);
                if(resp.data.data.tipo === "painel")
                    navigate("/painel/unidade/"+id);
            }
            else{
                setErros(resp.data.msg);
            }
        }).catch((error) => {
            //console.log(error);
            setErros(["Erro ao se conectar com a API"]);
        })
    }
    

    return (
        <>
            <Erro erro={erros}/>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-3 bg1 scroll1 top1">
                        <div id="loginUnidades" className="scroll2 pb-5">
                            <div className="d-flex justify-content-center my-3 mt-5 mx-4 ho1">
                                <button className="bg2 w-100" onClick={() => unidadeLogin("admin", "Admin")}>
                                    Admin
                                </button>    
                            </div>
                            
                            {
                                unidades.map((item, index) => {
                                    return (
                                        <div className="d-flex justify-content-center my-3 mx-4 ho1" key={index}>
                                            <button className="bg2 tx1 w-100" onClick={() => unidadeLogin(item._id, item.name)}>
                                                {item.name}
                                            </button>    
                                        </div>
                                        
                                    )
                                })
                            }    
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="d-flex justify-content-end p-4">
                            <img src={logo} alt="Prefeitura Municipal de Parobé" id="loginImg"/>
                        </div>
                        <div className={`${unidade} mx-5`}>
                            <h1 className="fw-bold fs-2 mx-5 mb-5">LOGIN - {name}</h1>
                            <form className="mx-5" onSubmit={(e) => {funLogin(e)}}>
                                <div className="mt-5">
                                    <label htmlFor="login" className="fs-5 ms-4 mb-1">Usuário</label>
                                    <div className="d-flex position-relative" id="input">
                                        <div className="bg2 px-4">
                                            <i className="bi bi-person-fill"></i>
                                        </div>
                                        <input onChange={(e) => {setLogin(e.target.value)}} className="w-100" type="text" name="login" placeholder="Digite..."/>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <label htmlFor="password" className="fs-5 ms-4 mb-1">Senha</label>
                                    <div className="d-flex position-relative" id="input">
                                        <div className="bg2 px-4">
                                            <i className="bi bi-key-fill"></i>
                                        </div>
                                        <input onChange={(e) => {setPassword(e.target.value)}} className="w-100" type="password" name="password" placeholder="Digite..."/>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center my-5">
                                    <button type="submit" className="ho1 mt-5 p-3 px-5 bg1 text-white fw-bold rounded-pill border border-0">Entrar</button>
                                </div>
                            </form>   
                        </div>
                        <p className="position-absolute bottom-0 end-0 me-4">Versão 1.0</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;