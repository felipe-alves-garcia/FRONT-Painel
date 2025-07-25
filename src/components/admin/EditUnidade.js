import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react" 
import axios from "axios"

import Header from "../Header"
import Erro from "../Erro"

function EditUnidade (){
    const navigate = useNavigate();

    const url = "http://10.10.112.4:7002"

    const { unidade } = useParams();
    const { id } = useParams();

    const [ user, setUser ] = useState(undefined);
    const [ unidadeName, setUnidadeName ] = useState(undefined)
    const [ erros, setErros ] = useState([]);

    useEffect(() => {
        setUnidadeName(unidade);
        setUser(JSON.parse(localStorage.getItem("user")));
    }, [unidade]);

    //

    const [ newName, setNewName ] = useState("");

    function funEdit (e){
        e.preventDefault();
        axios.put(`${url}/unidade/edit/${id}`,{
            name:newName,
        },{
            headers:{
                token:user.token,
                login:user.name,
                user:user.tipo
            }
        }).then((resp) => {
            if (resp.data.status)
                navigate("/admin/home");
            else{
                setErros(resp.data.msg);
                if(resp.data.msg[0] === "Usuário Inválido"){
                    setTimeout(() => {navigate("/login")}, 3000);
                }
            }
        }).catch((error) => {
            setErros(["Erro ao se conectar com a API"])
        })
    }

    function funDel (){
        axios.delete(`${url}/unidade/del/${id}`,{
            headers:{
                token:user.token,
                login:user.name,
                user:user.tipo
            }
        }).then((resp) => {
            if(resp.data.status)
                navigate("/admin/home");
            else{
                setErros(resp.data.msg);
                if(resp.data.msg[0] === "Usuário Inválido"){
                    setTimeout(() => {navigate("/login")}, 3000);
                }
            }
        }).catch((error) => {
            setErros(["Erro ao se conectar com a API"])
        })
    }

    return(
        <>
            <Header back="link"/>
            <Erro erro={erros}/>
            <div className="container mt-5">
                <div className="row">
                    <div id="divUnidade" className="col-12 p-5 rounded-5">
                        <h1 className="text-white fs-3 mb-5 pb-5">{unidadeName}</h1>
                    </div>
                    <form onSubmit={(e) => {funEdit(e)}}>
                        <div className="mt-5">
                            <label htmlFor="name" className="fs-5 ms-4 mb-1">Novo Nome</label>
                            <div className="d-flex position-relative" id="input">
                                <div className="bg2 px-4">
                                    <i className="bi bi-building-fill"></i>
                                </div>
                                <input onChange={(e) => {setNewName(e.target.value)}} className="w-100" type="text" name="login" placeholder="Digite..."/>
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

export default EditUnidade