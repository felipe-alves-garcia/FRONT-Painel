import { useParams } from "react-router-dom"
import { useState, useEffect } from "react" 
import axios from "axios"

import Header from "./Header"

function Locais (){
    const url = "http://localhost:7002"

    const { unidade } = useParams();
    const { id } = useParams();

    const [ user, setUser ] = useState({});
    const [ unidadeName, setUnidadeName ] = useState(undefined);
    const [ locais, setLocais ] = useState([]);

    useEffect(() => {
        setUnidadeName(unidade);
        setUser(JSON.parse(localStorage.getItem("user")));
    }, [unidade]);

    useEffect(() => {
        function dados (){
            axios.get(`${url}/unidade/locais/${id}`, {
                headers:{
                    token:user.token,
                    login:user.name,    
                }
                
            }).then((resp) => {
                console.log(resp.data);
                if (resp.data.data !== undefined)
                    setLocais(resp.data.data);
            }).catch((error) => {
                console.log(error);
            })    
        } dados();

        const interval = setInterval(dados, 3000);

        return () => clearInterval(interval);
        
    }, [id, user])

    return(
        <>
            <Header back="link"/>
            <div className="container mt-5">
                <div className="row mb-5">
                    <div id="divUnidade" className="col-12 p-5 mb-5 rounded-5">
                        <h1 className="text-white fs-3 mb-5 pb-5">{unidadeName} - Locais</h1>
                    </div>
                    {
                        locais.map((item, index) => {

                            return (
                                <a href={`/admin/unidade/local/edit/${id}/${item.name}`} className="a ho1 col-12 p-4 mb-4 rounded-pill d-flex bg4" key={index}>
                                    <p className="tx1 fw-bold m-0 fs-5 ps-5">{item.name}</p>
                                </a>
                            )
                        })
                    }
                    <a href={`/admin/unidade/local/add/${id}`} className="a ho1 col-12 p-4 mb-4 rounded-pill d-flex justify-content-center bg4">
                        <i className="tx1 fw-bold m-0 fs-5 bi bi-plus-circle"></i>
                    </a>
                </div>
            </div>
        </>
    )
}

export default Locais