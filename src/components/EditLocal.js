import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import axios from "axios"

import Header from "./Header"

function EditLocal (){

    const url = "http://localhost:7002";
    
    const { localName } = useParams();
    const { id } = useParams();
    const [ user, setUser ] = useState(undefined);
    const [ local, setLocal ] = useState({});

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
    }, [])

    useEffect(() => {
        if (user !== undefined){
            axios.get(`${url}/unidade/Local/${id}/${localName}`, {
                headers:{
                    token:user.token,
                    login:user.name
                }
            }).then((resp) => {
                setName(resp.data.data.locais[0].name);
                setLocal(resp.data.data.locais[0]);
                console.log(resp.data.data.users[0]);
            }).catch((error) => {
                console.log(error);
            });
        }
        
    }, [user, id, localName])

    //

    const [ name, setName ] = useState("")

    function funEdit(e){
        e.preventDefault();
        axios.put(`${url}/unidade/local/edit/${id}`,{
            lastName:local.name,
            name:name,
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
        axios.delete(`${url}/unidade/local/del/${id}/${local.name}`,{
            headers:{
                token:user.token,
                login:user.name,
                user:user.tipo
            }
        }).then((resp) => {
            console.log(resp.data);
            alert("⚠️ Atenção! Os usuários que pertenciam a esse local, ficaram sem local de trabalho!");
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
                        <h1 className="text-white fs-3 mb-5 pb-5">{local.name}</h1>
                    </div>
                    <form onSubmit={(e) => {funEdit(e)}}>
                        <div className="mt-5">
                            <label htmlFor="name" className="fs-5 ms-4 mb-1">Nome</label>
                            <div className="d-flex position-relative" id="input">
                                <div className="bg2 px-4">
                                    <i className="bi bi-building-fill"></i>
                                </div>
                                <input onChange={(e) => {setName(e.target.value)}} className="w-100" type="text" name="login" placeholder="Digite..." value={name}/>
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

export default EditLocal