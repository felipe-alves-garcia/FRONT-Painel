import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react" 
import axios from "axios"

import Header from "../Header"
import Erro from "../Erro"

function Users (){
    const url = "http://10.10.112.4:7002"

    const { unidade } = useParams();
    const { id } = useParams();

    const [ user, setUser ] = useState(undefined);
    const [ unidadeName, setUnidadeName ] = useState(undefined);
    const [ users, setUsers ] = useState([]);
    const [ erros, setErros ] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setUnidadeName(unidade);
        setUser(JSON.parse(localStorage.getItem("user")));
    }, [unidade]);

    useEffect(() => {
        if (user !== undefined){
            function dados (){
                axios.get(`${url}/unidade/users/${id}`, {
                    headers:{
                        token:user.token,
                        login:user.name,    
                    }
                    
                }).then((resp) => {
                    if (resp.data.status)
                        setUsers(resp.data.data);
                    else{
                        setErros(resp.data.msg);
                        if(resp.data.msg[0] === "Usuário Inválido"){
                            setTimeout(() => {navigate("/login")}, 3000);
                        }
                    }
                }).catch((error) => {
                    setErros(["Erro ao se conectar com a API"]);
                })    
            } dados();

            const interval = setInterval(dados, 3000);

            return () => clearInterval(interval);    
        }
    }, [id, user, navigate])

    return(
        <>
            <Header back="link"/>
            <Erro erro={erros}/>
            <div className="container mt-5">
                <div className="row mb-5">
                    <div id="divUnidade" className="col-12 p-5 mb-5 rounded-5">
                        <h1 className="text-white fs-3 mb-5 pb-5">{unidadeName} - Usuários</h1>
                    </div>
                    {
                        users.map((item, index) => {

                            return (
                                <a href={`/admin/unidade/user/edit/${id}/${item.login}`} className="a ho1 col-12 p-4 mb-4 rounded-pill d-flex bg4" key={index}>
                                    <p className="tx1 fw-bold m-0 fs-5 ps-5">{item.login} - <span className="fw-normal">{item.tipo} - {item.local}</span></p>
                                </a>
                            )
                        })
                    }
                    <a href={`/admin/unidade/user/add/${id}`} className="a ho1 col-12 p-4 mb-4 rounded-pill d-flex justify-content-center bg4">
                        <i className="tx1 fw-bold m-0 fs-5 bi bi-plus-circle"></i>
                    </a>
                </div>
            </div>
        </>
    )
}

export default Users