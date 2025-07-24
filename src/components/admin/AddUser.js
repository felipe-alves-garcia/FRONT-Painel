import axios from "axios"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import Header from "../Header"

function AddUser (){

    const { id } = useParams()
    const [ user, setUser ] = useState(undefined);
    const [ locais, setLocais ] = useState([])
    const url = "http://10.10.112.4:7002"

    const [ login, setLogin ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ password2, setPassword2 ] = useState("");
    const [ tipo, setTipo ] = useState("triagem");
    const [ local, setLocal ] = useState("");

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
    }, [])

    useEffect(() => {
        if(user !== undefined){
            axios.get(`${url}/unidade/locais/${id}`, {
                headers:{
                    token:user.token,
                    login:user.name
                }
            }).then((resp) => {
                console.log(resp.data.data);
                setLocais(resp.data.data)
                setLocal(resp.data.data[0].name)
            }).catch((error) => {
                console.log(error);
            });    
        }
    }, [user, id])
    
    function funAdd (e){
        console.log(local+"\n"+tipo)
        e.preventDefault();
        if (
            login !== "" &&
            password !== "" &&
            password2 !== "" &&
            tipo !== "" &&
            local !== ""
        ){
            axios.post(`${url}/unidade/user/add/${id}`, {
                "login":login,
                "type":tipo,
                "password":password,
                "password2":password2,
                "local":local,
            }, {
                headers:{
                    token:user.token,
                    login:user.name,
                    user:user.tipo
                }
            }).then((resp) => {
                console.log(resp.data);
                if (resp.data.status)
                    window.history.back();
            }).catch((error) => {
                console.log(error);
            })    
        }
        
    }

    return (
        <>
            <Header back="link"/>
            <main>
                <div className="container-fluid px-5 pb-5">
                    <div className="row">
                        <div className="col-12 mt-5">
                            <h1 className="fw-bold fs-2 mt-4 mb-5">ADICIONAR USUÁRIO</h1>
                        </div>
                        <form onSubmit={(e) => {funAdd(e)}}>
                            <div className="mt-5">
                                <label htmlFor="name" className="fs-5 ms-4 mb-1">Nome</label>
                                <div className="d-flex position-relative" id="input">
                                    <div className="bg2 px-4">
                                        <i className="bi bi-person-fill"></i>
                                    </div>
                                    <input onChange={(e) => {setLogin(e.target.value)}} className="w-100" type="text" name="login" placeholder="Digite..." value={login}/>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="password" className="fs-5 ms-4 mb-1">Senha</label>
                                <div className="d-flex position-relative" id="input">
                                    <div className="bg2 px-4">
                                        <i className="bi bi-key-fill"></i>
                                    </div>
                                    <input onChange={(e) => {setPassword(e.target.value)}} className="w-100" type="password" name="password" placeholder="Digite..." value={password}/>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="password" className="fs-5 ms-4 mb-1">Senha Novamente</label>
                                <div className="d-flex position-relative" id="input">
                                    <div className="bg2 px-4">
                                        <i className="bi bi-key-fill"></i>
                                    </div>
                                    <input onChange={(e) => {setPassword2(e.target.value)}} className="w-100" type="password" name="password" placeholder="Digite..." value={password2}/>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="tipo" className="fs-5 ms-4 mb-1">Tipo</label>
                                <div className="d-flex position-relative" id="input">
                                    <div className="bg2 px-4">
                                        <i className="bi bi-bookmark-fill"></i>
                                    </div>
                                    <select className="w-100" value={tipo} onChange={(e) => {setTipo(e.target.value)}}>
                                        <option value="triagem">triagem</option>
                                        <option value="atendimento">atendimento</option>
                                        <option value="painel">painel</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="local" className="fs-5 ms-4 mb-1">Local</label>
                                <div className="d-flex position-relative" id="input">
                                    <div className="bg2 px-4">
                                        <i className="bi bi-building-fill"></i>
                                    </div>
                                    <select className="w-100" value={local} onChange={(e) => {setLocal(e.target.value)}}>
                                        {
                                            locais.map((item, index) => {

                                                return(
                                                    <option key={index} value={item.name}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center my-5 align-items-center">
                                <button type="submit" className="mx-5 ho1 fs-5 mt-5 p-3 px-5 bg1 text-white fw-bold rounded-pill border border-0">
                                    Adicionar
                                    <i className="ms-3 bi bi-plus-circle-fill"></i>
                                </button>
                            </div>
                        </form>   
                    </div>
                </div>
            </main>
        </>
    )
}

export default AddUser