import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import axios from "axios"

import Header from "../Header"

function EditUser (){

    const url = "http://localhost:7002";
    
    const { userName } = useParams();
    const { id } = useParams();
    const [ user, setUser ] = useState(undefined);
    const [ userInfo, setUSerInfo ] = useState({});
    const [ locais, setLocais ] = useState([]);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
    }, [])

    useEffect(() => {
        if (user !== undefined){
            axios.get(`${url}/unidade/user/${id}/${userName}`, {
                headers:{
                    token:user.token,
                    login:user.name
                }
            }).then((resp) => {
                setUSerInfo(resp.data.data.users[0]);
                setTipo(resp.data.data.users[0].tipo);
                setLogin(resp.data.data.users[0].login);
                setLocal(resp.data.data.users[0].local);
                setPassword(resp.data.data.users[0].password)
                console.log(resp.data.data.users[0]);
            }).catch((error) => {
                console.log(error);
            });

            axios.get(`${url}/unidade/locais/${id}`, {
                headers:{
                    token:user.token,
                    login:user.name
                }
            }).then((resp) => {
                console.log(resp.data.data);
                setLocais(resp.data.data)
            }).catch((error) => {
                console.log(error);
            });    
        }
        
    }, [user, id, userName])

    //

    const [ login, setLogin ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ tipo, setTipo ] = useState("");
    const [ local, setLocal ] = useState("")

    function funEdit(e){
        e.preventDefault();
        axios.put(`${url}/unidade/user/edit/${id}`,{
            lastLogin:userInfo.login,
            login:login,
            tipo:tipo,
            password:password,
            local:local,
        },{
            headers:{
                token:user.token,
                login:user.name,
                user:user.tipo
            }
        }).then((resp) => {
            console.log(resp.data);
            if (resp.data.status) window.history.back();
        }).catch((error) => {
            console.log(error)
        })
    }

    function funDel(){
        axios.delete(`${url}/unidade/user/del/${id}/${userInfo.login}`,{
            headers:{
                token:user.token,
                login:user.name,
                user:user.tipo
            }
        }).then((resp) => {
            console.log(resp.data);
            if (resp.data.status) window.history.back();
        }).catch((error) => {
            console.log(error);
        })
    }




    return (
        <>
            <Header back="link"/>
            <div className="container mt-5">
                <div className="row">
                    <div id="divUnidade" className="col-12 p-5 rounded-5">
                        <h1 className="text-white fs-3 mb-5 pb-5">{userInfo.login}</h1>
                    </div>
                    <form onSubmit={(e) => {funEdit(e)}}>
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
                                <input onChange={(e) => {setPassword(e.target.value)}} className="w-100" type="text" name="password" placeholder="Digite..." value={password}/>
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
                                                <option key={item._id} value={item.name}>{item.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center my-5 align-items-center">
                            <button type="submit" className="mx-5 ho1 fs-5 mt-5 p-3 px-5 bg1 text-white fw-bold rounded-pill border border-0">
                                Atualizar
                                <i className="ms-3 bi bi-arrow-up-circle-fill"></i>
                            </button>
                            <button type="button" onClick={() => {funDel()}} className="mx-5 ho1 fs-5 mt-5 p-3 px-5 bg3 text-white fw-bold rounded-pill border border-0">
                                Deletar
                                <i className="ms-3 bi bi-trash-fill"></i>
                            </button>
                        </div>
                    </form>   
                </div>
            </div>
        </>
    )
}

export default EditUser