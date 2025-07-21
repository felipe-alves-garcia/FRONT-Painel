import axios from "axios";
import { useState, useEffect } from "react";

import Header from "./Header.js"

function Home (){
    const [unidades, setUnidades] = useState([]);
    const url = "http://localhost:7002";

    function buscarUnidades (){
        function dados (){
            axios.get(`${url}/unidades`).then((resp) => {
                setUnidades(resp.data.data);
                console.log(resp);
            }).catch((error) => {
                console.log(error);
            })     
        } dados();

        const interval = setInterval(dados, 3000);

        return () => clearInterval(interval);
           
    }

    useEffect(() => {
        buscarUnidades();
    }, [])

    return (
        <>
            <Header back="/login"/>
            <main>
                <div className="container-fluid px-5 pb-5">
                    <div className="row">
                        <div className="col-12 mt-5">
                            <h1 className="fw-bold fs-2 mt-4 mb-5">UNIDADES</h1>
                        </div>
                        {
                            unidades.map((item, index) => {
                                
                                return (
                                    <div className="col-4 px-3 py-3" key={index}>
                                        <div className="bg1 px-4 py-5 rounded-5">
                                            <h2 className="mx-3 fs-3 text-white">{item.name}</h2>
                                            <hr className="mb-4 border border-white mx-3"/>
                                            <div className="mx-3">
                                                <a href={`/admin/unidade/users/${item.name}/${item._id}`} className="mb-2 a ho1 text-white bg2 d-block fs-5 rounded-pill px-4 py-2">
                                                    <i className="bi bi-people-fill me-3"></i>
                                                    Usuários
                                                </a>
                                                <a href={`/admin/unidade/locais/${item.name}/${item._id}`} className="mb-2 a ho1 text-white bg2 d-block fs-5 rounded-pill px-4 py-2">
                                                    <i className="bi bi-building-fill me-3"></i>
                                                    Locais
                                                </a>
                                                <a href={`/admin/unidade/edit/${item.name}/${item._id}`} className="mb-2 a ho1 text-white bg2 d-block fs-5 rounded-pill px-4 py-2">
                                                    <i className="bi bi-pencil-square me-3"></i>
                                                    Editar Unidade
                                                </a>
                                            </div>
                                            <div className="container-fluid mt-4">
                                                <div className="row mx-1">
                                                    <div className="col-6">
                                                        <div className="rounded-4 fw-bold py-5 fs-4 text-white d-flex justify-content-center align-items-center" id="numbers">
                                                            <i className="bi bi-people-fill me-3"></i>
                                                            {item.users}    
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="rounded-4 fw-bold py-5 fs-4 text-white d-flex justify-content-center align-items-center" id="numbers2">
                                                            <i className="bi bi-building-fill me-3"></i>
                                                            {item.locais}    
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div className="col-4 d-flex justify-content-center align-items-center">
                            <a href="/admin/unidade/add" className="ho1 bg1 px-4 p-3 m-0 rounded-pill">
                                <i className="p-0 bi bi-plus-circle fs-1 text-white"></i>    
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Home;