import axios from "axios";
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import Header from "../Header"
import Erro from "../Erro"

function Triagem (){

    const url = "http://10.10.112.4:7002"

    const { id } = useParams();
    const [ locais, setLocais ] = useState([]);
    const [ user, setUser ] = useState(undefined)
    const [ erros, setErros ] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
    }, []);

    useEffect(() => {
        if (user !== undefined){
            function dados (){
                axios.get(`${url}/unidade/locais/${id}`, {
                    headers:{
                        token:user.token,
                        login:user.name,    
                    }
                    
                }).then((resp) => {
                    if (resp.data.status)
                        setLocais(resp.data.data);
                    else{
                        setErros(resp.data.msg);
                    }
                }).catch((error) => {
                    setErros(["Erro ao listar locais"])
                })    
            } dados();

            const interval = setInterval(dados, 10000);

            return () => clearInterval(interval);    
        }
    }, [id, user])

    //

    const [ local, setLocal ] = useState("");
    const [ senha, setSenha ] = useState("d-none");

    function funSenha (tipo){
        axios.put(`${url}/fila/senha/add/${id}`, {
            "local":local,
            "tipo":tipo
        },{
            headers:{
                token:user.token,
                login:user.name,
                user:user.tipo
            }
        }).then((resp) => {
            if(resp.data.status)
                imprimirSenha(resp.data.data.senha.senha, local, tipo, resp.data.data.senha.divison)
            else{
                setErros(resp.data.msg);
                if(resp.data.msg[0] === "Usuário Inválido"){
                    setTimeout(() => {navigate("/login")}, 3000);
                }
            }
        }).catch((error) => {
            setErros(["Erro ao gerar senha"])
        })
    }

    //

    function imprimirSenha(senha, local, tipo, divison) {
        const janela = window.open('', '_blank', 'width=800,height=500');
        janela.document.write(`
            <html>
            <head>
                <title>Senha</title>
                <style>
                    body { font-family: monospace; font-size: 18px; text-align: center; margin-top: 50px; }
                    .senha { font-size: 48px; font-weight: bold; }
                    .local { font-size: 30px; font-weight: bold; }
                    .tipo { margin-top: 10px; font-size: 20px; }
                </style>
            </head>
            <body onload="window.print(); setTimeout(() => window.close(), 100);">
                <div class="senha">SENHA:${divison}${senha}</div>
                <div class="local">${local}</div>
                <div class="tipo">${tipo}</div>
                <div style="margin-top:40px;">${new Date().toLocaleString()}</div>
            </body>
            </html>
        `);
        janela.document.close();
    }

    //

    function recarregarFila() {
        const confirmado = window.confirm("Tem certeza que deseja deletar?");
        if (confirmado) {
            locais.forEach((l, index) => {
                axios.delete(`${url}/fila/senhas/del/${id}/${l.name}`, {
                    headers:{
                        token:user.token,
                        login:user.name,
                        user:user.tipo
                    }
                }).then((resp) => {
                    if (!resp.data.status){
                        setErros(resp.data.msg)
                        if(resp.data.msg[0] === "Usuário Inválido"){
                            setTimeout(() => {navigate("/login")}, 3000);
                        }
                    }
                }).catch((error) => {
                    setErros(["Erro ao recarregar filas"]);
                })
            })
        }
    }


    return (
        <>
            <Header back="/login"></Header>
            <Erro erro={erros}/>
            <div className="container mt-5">
                <div className="row mb-5 pt-5">
                    {
                        locais.map((item, index) => {

                            return (
                                <div className="d-flex justify-content-center col-4" key={index}>
                                    <button onClick={(e) => {setLocal(item.name); setSenha("d-block")}} className="a ho1 w-100 d-flex justify-content-center p-4 mb-5 rounded-pill bg4" key={index}>
                                        <p className="tx1 fw-bold m-0 fs-5">{item.name}</p>
                                    </button>    
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="container py-5">
                <div className="row">
                    <div className="d-flex justify-content-center">
                        <button onClick={recarregarFila} className="d-inline bg0 border border-0 tx2 ho1">
                            <i className="bi bi-arrow-clockwise"></i>
                            <p className="m-0">Recarregar Senhas</p>
                        </button>    
                    </div>
                </div>
            </div>
            <div className={`position-absolute top-0 appTotal bg10 container-fluid ${senha}`}>
                <div className="top1 row w-100 d-flex justify-content-center align-items-center">
                    <div className="col-6 bg5 rounded-5 p-5">
                        <p className="text-white fs-5">Selecione o tipo de senha:</p>
                        <div className="container-fluid pt-4">
                            <div className="row mt-5">
                                <div className="col-6 d-flex justify-content-center">
                                    <button onClick={(e) => {funSenha("normal"); setSenha("d-none")}} className="ho1 bg6 text-white fs-5 fw-bold border border-0 w-75 rounded-1 py-2">Normal</button>
                                </div>
                                <div className="col-6 d-flex justify-content-center">
                                    <button onClick={(e) => {funSenha("prioridade"); setSenha("d-none")}} className="ho1 bg3 text-white fs-5 fw-bold border border-0 w-75 rounded-1 py-2">Prioridade</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Triagem