import axios from "axios"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import Header from "../Header"
import Erro from "../Erro"

function Atendimento (){

    const url = "http://10.10.112.4:7002"
    
    const { id } = useParams();
    const [ fila, setFila ] = useState([]);
    const [ user, setUser ] = useState(undefined)
    const [ erros, setErros ] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
    }, []);

    useEffect(() => {
        if (user !== undefined){
            function dados (){
                axios.get(`${url}/fila/senhas/${id}/${user.local}`, {
                    headers:{
                        token:user.token,
                        login:user.name,    
                        user:user.tipo
                    }
                    
                }).then((resp) => {
                    if (resp.data.status)
                        setFila(resp.data.data);
                    else{
                        setErros(resp.data.msg);
                        if (resp.data.msg[0] === "Usuário Inválido")
                            setTimeout(() => {navigate("/login")}, 3000);
                    }
                }).catch((error) => {
                    setErros(["Erro ao listar senhas"]);
                })    
            } dados();

            const interval = setInterval(dados, 2000);

            return () => clearInterval(interval);    
        }
    }, [id, user, navigate])

    //

    const [ chamar, setChamar ] = useState("d-none");
    const [ senha, setSenha ] = useState({});

    function funChamar (){
        axios.put(`${url}/fila/senha/chamar/${id}/${user.local}`, {},{
            headers:{
                token:user.token,
                login:user.name,    
                user:user.tipo
            }
        }).then((resp) => {
            if (resp.data.status || resp.data.msg[0] === "Chamada Existente"){
                setChamar("d-block")
                setSenha(resp.data.data.senhaChamada);
            }
            else{
                setErros(resp.data.msg);
                if (resp.data.msg[0] === "Usuário Inválido")
                    setTimeout(() => {navigate("/login")}, 3000);
            }
        }).catch((error) => {
            setErros(["Erro ao chamar senha"]);
        })
    }

    //

    function funAtender (){
        axios.put(`${url}/fila/senha/atender/${id}/${user.local}`, {},{
            headers:{
                token:user.token,
                login:user.name,    
                user:user.tipo
            }
        }).then((resp) => {
            if (resp.data.status)
                setChamar("d-none")
            else{
                setErros(resp.data.msg);
                if (resp.data.msg[0] === "Usuário Inválido")
                    setTimeout(() => {navigate("/login")}, 3000);
            }
        }).catch((error) => {
            setErros(["Erro ao iniciar atendimento"])
        })
    }

    return (
        <>
            <Header back="/login"/>
            <Erro erro={erros}/>
            <div className="container">
                <div className="row">
                    <div className="col-12 bg4 border border-none p-5 mt-5 tx1 rounded-5">
                        <h1 className="fw-bold fs-2 mb-4">Senhas</h1>
                        {
                            fila.map((senha, i) => {
                                
                                let tipo = "bg3"
                                if (senha.tipo === "normal")
                                    tipo = "bg2"

                                return(
                                    <div className="px-4 col-12" key={i}>
                                        <div className="container-fluid">
                                            <div className="row pb-3">
                                                <hr className="col-12"/>
                                                <p className="px-4 py-2 m-0 fw-bold col-10">{senha.divison}{senha.senha}</p>
                                                <div className="col-2">
                                                    <div className={`p-2 ${tipo} text-white text-center rounded-1`}><p className="m-0">{senha.tipo}</p></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>    
                                ) 
                            })
                        }
                        <hr className="mx-4 mt-0"/>
                    </div>
                    <div className="col-12 mb-5 pb-5">
                        <div className="d-flex justify-content-center mt-5">
                            <button type="button" onClick={ () => {funChamar()}} className="ho1 mt-5 p-3 px-5 bg1 text-white fw-bold rounded-pill border border-0">
                                Chamar
                                <i className="ps-3 bi bi-volume-up-fill"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`position-absolute top-0 appTotal bg10 container-fluid ${chamar}`}>
                <div className="top1 row w-100 d-flex justify-content-center align-items-center">
                    <div className="col-8 bg5 rounded-5 p-5">
                        <p className="text-white fs-5">Senha: <span className="fw-bold">{senha.divison}{senha.senha}</span></p>
                        <div className="container-fluid pt-4">
                            <div className="row mt-5">
                                <div className="col-6 px-3 d-flex justify-content-center">
                                    <button onClick={() => {funAtender()}} className="ho1 bg8 py-5 fs-5 fw-bold w-100 rounded-1">Iniciar Atendimento</button>
                                </div>
                                <div className="col-4 d-none px-3 d-flex justify-content-center">
                                    <button className="ho1 bg7 py-5 fs-5 fw-bold w-100 rounded-1">Chamar Novamente</button>
                                </div>
                                <div className="col-6 px-3 d-flex justify-content-center">
                                    <button onClick={() => {funAtender()}} className="ho1 bg9 py-5 fs-5 fw-bold w-100 rounded-1">Não Compareceu</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Atendimento