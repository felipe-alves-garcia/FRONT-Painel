import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios";

import Header from "../Header"
import Erro from "../Erro"

function Registros (){

    const url = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}`;

    const { id } = useParams()
    const [ user, setUser ] = useState(undefined)
    const [ locais, setLocais ] = useState([])
    const [ erros, setErros ] = useState([]);
    const [ verify, setVerify ] = useState("d-block")


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
    }, [id, user, url])

    return (
        <>
            <Header back="link"></Header>
            <Erro erro={erros}/>

            <div className="mt-5 container">
                {
                    locais.map((item) => {
                        return item.Registros.map((r, index) => {
                            if(verify == "d-block")
                                setVerify("d-none")
                            return (
                                <div className="px-4 mb-3">
                                    <p className="fw-bold fs-5 w-100">{item.name}</p> 
                                    <div className="border border-3 py-2 px-4 px-sm-5 w-100 rounded-5 d-flex justify-content-between mt-2">
                                        <p className="d-inline tx1 fw-bold m-0">{r.data}: </p>   
                                        <p className="d-inline m-0">{r.numRegistros} Senhas</p>    
                                    </div>
                                    
                                </div>
                            )
                        })
                    })
                }    
                <p className={`${verify} fw-bold fs-5 ps-5`}>Não há nenhum registro</p>
            </div>
        </>
    )
}

export default Registros