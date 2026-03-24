import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"

import logo from "../../assets/img/logo2.png"


import Erro from "../Erro"
import Senhas from "./Senhas"



function Painel2 (){

    const url = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}`;

    const { id } = useParams();
    const [ user, setUser ] = useState(undefined);
    const [ filaEstado, setFilaEstado ] = useState({});
    const [ filaMunicipio, setFilaMunicipio ] = useState({})
    const [ lastSenhas, setLastSenhas ] = useState([])
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
                }).then( async (resp) => {
                    if (resp.data.status){
                        setFilaEstado(resp.data.data[0].Filas)
                        setFilaMunicipio(resp.data.data[1].Filas)
                        last(resp.data.data)
                    }
                    else{
                        setErros(resp.data.msg);
                        if (resp.data.msg[0] === "Usuário Inválido")
                            setTimeout(() => {navigate("/login")}, 3000);
                    }
                }).catch((error) => {
                    setErros(["Erro ao listar senhas"]);
                })    
            } dados();

            const interval = setInterval(dados, 7000);

            return () => clearInterval(interval);    
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user])

    //

    const [dataHoraAtual, setDataHoraAtual] = useState(new Date());

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const intervalo = setInterval(() => {
        setDataHoraAtual(new Date());
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);

    function formatarData (data){
        return data.toLocaleString('pt-BR', {
        //weekday:'short', 
        year: 'numeric',
        month: 'numeric',// 'long'
        day: 'numeric',
        });
    };
    function formatarHora (data){
        return data.toLocaleString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        });
    };

    async function last(filas){
        let buildLast = [];
        for(let f=0; f < filas.length; f++){
            try{
                const resp = await axios.get(`${url}/fila/senhas/last/${id}/${filas[f].name}`, {
                    headers:{
                        token:user.token,
                        login:user.name,    
                    }
                })
                buildLast[(f*2)+0] = resp.data.data[0];
                buildLast[(f*2)+1] = resp.data.data[1];
            } catch(error){
                setErros(["Erro ao listar senhas"]);
            }
        }

        setLastSenhas(buildLast)
    }

    //

    return (
        <>
            <Erro erro={erros}/>
            <div className={`container-fluid app`}>
                <div className="row d-none d-md-flex">
                    <div className="z2 col-md-4 col-lg-3 app bg1 d-flex flex-column justify-content-between">
                        <a href="/login" className="a ho1 w-100 px-3 pe-4 my-4">
                            <img className="w-100" src={logo} alt="Prefeitura Municipal de Parobé"/>    
                        </a>
                        <div className="d-flex flex-column px-4">
                            {
                                lastSenhas.map((item, index) => {
                                    if(index < 5 && item !== undefined){
                                        return (
                                            <p key={index} className="text-center m-0 mt-3 mb-1 d-inline fs-3 fw-bold bg4 rounded-5 py-2">&nbsp;{item.division}{item.senha} - {item.tipo}</p>
                                        )    
                                    }
                                })
                            }
                        </div>
                        <div className="mb-3 d-flex flex-column align-items-center">
                            <p className="fs-4 mb-2 text-white text-center">{formatarData(dataHoraAtual)}</p>
                            <hr className="m-0 border border-white w-75"></hr>
                            <p className="fs-1 fw-bold my-0 text-white text-center">{formatarHora(dataHoraAtual)}</p>
                        </div>
                    </div>
                    <div className="col-md-8 col-lg-9 d-flex justify-content-center align-items-center">
                        <Senhas local="Município" fila={filaMunicipio}/>
                        <Senhas local="Estado" fila={filaEstado}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Painel2