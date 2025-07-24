import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import Header from "../Header"

function AddUnidade (){

    const navigate = useNavigate()

    const [ user, setUser ] = useState({});
    const [ name, setName ] = useState("");
    const url = "http://10.10.112.4:7002"

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
    }, [])
    
    function funAdd (e){
        e.preventDefault();
        if(name !== ""){
            axios.post(`${url}/unidade/add`, {
                "name":name
            }, {
                headers:{
                    token:user.token,
                    login:user.name,
                    user:user.tipo
                }
            }).then((resp) => {
                console.log(resp.data);
                if (resp.data.status)
                    navigate("/admin/home")
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
                            <h1 className="fw-bold fs-2 mt-4 mb-5">ADICIONAR UNIDADE</h1>
                        </div>
                        <form onSubmit={(e) => {funAdd(e)}}>
                            <div className="mt-5">
                                <label htmlFor="name" className="fs-5 ms-4 mb-1">Nome</label>
                                <div className="d-flex position-relative" id="input">
                                    <div className="bg2 px-4">
                                        <i className="bi bi-building-fill"></i>
                                    </div>
                                    <input onChange={(e) => {setName(e.target.value)}} className="w-100" type="text" name="name" placeholder="Digite..."/>
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

export default AddUnidade