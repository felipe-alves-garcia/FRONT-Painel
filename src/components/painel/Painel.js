import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"

import logo from "../../assets/img/logo2.png"
import som1 from "../../assets/som/som1.mp3"
//import som2 from "../../assets/som/som2.mp3"
//import som3 from "../../assets/som/som3.mp3"

import Erro from "../Erro"

import Midia from "./Midia"


function Painel (){

    const url = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}`;

    const { id } = useParams();
    const [ user, setUser ] = useState(undefined);
    const [ senha, setSenha ] = useState({});
    const [ local, setLocal ] = useState("")
    const [ prioridade, setPrioridade ] = useState("text-success-emphasis d-none")
    const [ prioridade2, setPrioridade2 ] = useState("text-success-emphasis")
    const [ lastSenhas, setLastSenhas ] = useState([]); 
    const [ resolusaoH, setResolusaoH ] = useState("d-block")
    const [ resolusaoV, setResolusaoV ] = useState("d-none")
    const audio = new Audio(som1);
    const [ midia, setMidia ] = useState("jhf")
    const [ erros, setErros ] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
        if (window.innerWidth < window.innerHeight){
            setResolusaoH("d-none")
            setResolusaoV("d-block")
        }
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
                    console.log(resp)
                    if (resp.data.status){
                        funChamar(resp.data.data)
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

            const interval = setInterval(dados, 10000);

            return () => clearInterval(interval);    
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user])

    //

    async function funChamar(filas){
        console.log(lastSenhas)
        let count = 0;
        for(let i=0; i<filas.length; i++){
            let chamado = false;
            let numSenhas = 0;
            if (filas[i].Filas.length > 0) count++;
            for(let s=0; s<filas[i].Filas.length; s++){
                if (filas[i].Filas[s].chamado === true && filas[i].Filas[s].atendido === false){
                    numSenhas++;
                    if(numSenhas)
                    setLocal(filas[i].name)
                    if (filas[i].Filas[s].sublocal === "none"){
                        filas[i].Filas[s].sublocal = "";
                    }
                    setSenha(filas[i].Filas[s]);
                    if(filas[i].Filas[s].tipo === "normal"){
                        setPrioridade("text-success-emphasis d-none")
                        setPrioridade2("")
                    } else{
                        setPrioridade("text-danger")
                        setPrioridade2("text-danger")
                    }
                    try{
                        await audio.play();
                    } catch (error){

                    }
                }
                else if (filas[i].Filas[s].atendido === true){
                    let status = false;
                    for (let t=0; t<lastSenhas.length; t++){
                        if(
                            lastSenhas[t].division === filas[i].Filas[s].division &&
                            lastSenhas[t].senha === filas[i].Filas[s].senha
                        ) status = true;
                    }
                    if (!status){
                        let last = lastSenhas;
                        if (lastSenhas.length === 0)
                            last[lastSenhas.length] = filas[i].Filas[s];
                        else{
                            for(let l=lastSenhas.length; l>0; l--){
                                last[l] = last[l-1];
                            }
                            last[0] = filas[i].Filas[s];
                        }
                        setLastSenhas(last);
                        /*let last = [...lastSenhas];
                        last.unshift(filas[i].Filas[s]);
                        setLastSenhas(last.slice(0, 10)); */
                    }
                }
            }
            if (chamado) break;
        }
        if (count === 0) setLastSenhas([]);
    }

    //

    const [dataHoraAtual, setDataHoraAtual] = useState(new Date());

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

    //

    const [ link, setLink ] = useState("");
    const [ statusLink, setStatusLink ] = useState("d-block")

    function funLink(e){
        e.preventDefault()
        setStatusLink("d-none")
        setMidia(link.match(/\/([^/?]+)(\?|$)/)?.[1])
    }

    return (
        <>
            <Erro erro={erros}/>
            <div className={`container-fluid app bg1 ${resolusaoH}`}>
                <div className="row d-none d-md-flex">
                    <div className={`col-9 position-absolute p-3 end-0 ${statusLink}`}>
                        <form onSubmit={(e) => {funLink(e)}}>
                            <input className="rounded-1 w-100 bg0 text-white border border-secondary-subtle px-4" placeholder="Link do Vídeo" onChange={(e) => {setLink(e.target.value)}}/>    
                        </form>
                    </div>
                    <div className="z2 col-md-4 col-lg-3 app bg1 d-flex flex-column justify-content-between">
                        <a href="/login" className="a ho1 w-100 px-3 pe-4 my-4">
                            <img className="w-100" src={logo} alt="Prefeitura Municipal de Parobé"/>    
                        </a>
                        <div className="bg4 pb-3 mt-4 rounded-5">
                            <p className={`tx2 flex-column fw-bold text-center mt-2 mb-0 d-flex align-items-center justify-content-center ${prioridade2} d-flex`} style={{fontSize:100}}>{senha.division}{senha.senha} <span className={`ms-2 mt-0 fs-4 up ${prioridade}`}>({senha.tipo})</span></p>
                            <p className="tx1 fs-2 text-center">{local}{senha.sublocal}</p>
                        </div>
                        <div className="mb-3 d-flex flex-column align-items-center">
                            <p className="fs-4 mb-2 text-white text-center">{formatarData(dataHoraAtual)}</p>
                            <hr className="m-0 border border-white w-75"></hr>
                            <p className="fs-1 fw-bold my-0 text-white text-center">{formatarHora(dataHoraAtual)}</p>
                        </div>
                    </div>
                    <Midia link={`https://www.youtube.com/embed/${midia}?autoplay=1&mute=1`}/>
                    <div className="z3 col-12 position-absolute p-5 bg1 bottom-0">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-4 col-lg-3">

                                </div>
                                <div className="col-md-8 col-lg-9 d-flex justify-content-around">
                                    {
                                        lastSenhas.map((item, index) => {
                                            if(index < 5){
                                                return (
                                                    <p key={index} className="text-center text-white m-0 d-inline fw-bold">&nbsp;{item.division}{item.senha} - {item.tipo}</p>
                                                )    
                                            }
                                            return <></>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className={`container-fluid app bg1 ${resolusaoV}`}>
                <div className="row d-none d-md-flex">
                    <div className="col-6 d-flex flex-column justify-content-between">
                        <a href="/login" className="a ho1 w-100 px-3 pe-4 my-4">
                            <img className="w-100" src={logo} alt="Prefeitura Municipal de Parobé"/>    
                        </a>
                    </div>
                    <div className={`col-12 p-3 end-0 ${statusLink}`}>
                        <form onSubmit={(e) => {funLink(e)}}>
                            <input className="rounded-1 w-100 bg0 text-white border border-secondary-subtle px-4" placeholder="Link do Vídeo" onChange={(e) => {setLink(e.target.value)}}/>    
                        </form>
                    </div>
                    <Midia link={`https://www.youtube.com/embed/${midia}?autoplay=1&mute=1`}/>
                    <div className="col-12 d-flex flex-column justify-content-between">
                        <div className="bg4 mt-4 rounded-5">
                            <p className={`tx2 flex-column fw-bold text-center mt-2 mb-0 d-flex align-items-center justify-content-center ${prioridade2} d-flex`} style={{fontSize:130}}>{senha.division}{senha.senha} <span className={`ms-2 mt-0 fs-4 up ${prioridade}`}>({senha.tipo})</span></p>
                            <p className="tx1 txs1 text-center">{local}{senha.sublocal}</p>
                        </div>
                    </div>
                    <div className="col-12 p-5">
                        <hr className="m-0 border border-white w-100 mb-5"></hr>
                        {
                            lastSenhas.map((item, index) => {
                                if(index < 5){
                                    return (
                                        <p key={index} className="txs2 text-white m-0 mb-1">&nbsp;{item.division}{item.senha} - {item.tipo}</p>
                                    )    
                                }
                                return <></>
                            })
                        }
                        <hr className="m-0 border border-white w-100 mt-5"></hr>
                    </div>
                    <div className="col-12 d-flex flex-column justify-content-between position-absolute bottom-0">
                        <div className="mb-5 d-flex flex-column align-items-center">
                            <p className="fs-1 mb-3 text-white text-center">{formatarData(dataHoraAtual)}</p>
                            <hr className="m-0 border border-white w-25"></hr>
                            <p className="fs-1 fw-bold my-0 text-white text-center">{formatarHora(dataHoraAtual)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Painel