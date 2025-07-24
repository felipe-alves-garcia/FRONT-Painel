import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"

import logo from "../../assets/img/logo2.png"
import som1 from "../../assets/som/som1.mp3"
//import som2 from "../../assets/som/som2.mp3"
//import som3 from "../../assets/som/som3.mp3"

import Midia from "./Midia"


function Painel (){

    const url = "http://10.10.112.4:7002"

    const { id } = useParams();
    const [ user, setUser ] = useState(undefined);
    const [ senha, setSenha ] = useState({});
    const [ local, setLocal ] = useState("")
    const [ prioridade, setPrioridade ] = useState("text-success-emphasis d-none")
    const [ lastSenhas, setLastSenhas ] = useState([]); 
    const audio = new Audio(som1);
    const [ midia ] = useState("ciKV8i2DIv0?si=jXAzaSBM-SoFt6Rf")

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
                    
                }).then( async (resp) => {
                    //console.log(resp.data);
                    if (resp.data.data !== undefined){
                        funChamar(resp.data.data)
                    }
                }).catch((error) => {
                    console.log(error);
                })    
            } dados();

            const interval = setInterval(dados, 10000);

            return () => clearInterval(interval);    
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user])

    //

    async function funChamar(filas){
        for(let i=0; i<filas.length; i++){
            let chamado = false;
            let numSenhas = 0;
            for(let s=0; s<filas[i].fila.length; s++){
                if (filas[i].fila[s].chamado === true && filas[i].fila[s].atendido === false){
                    numSenhas++;
                    if(numSenhas)
                    setLocal(filas[i].name)
                    setSenha(filas[i].fila[s]);
                    (filas[i].fila[s].tipo === "normal") ? setPrioridade("text-success-emphasis d-none") : setPrioridade("text-danger")
                    try{
                        await audio.play();
                    } catch (error){

                    }
                }
                else if (filas[i].fila[s].atendido === true){
                    let status = false;
                    for (let t=0; t<lastSenhas.length; t++){
                        if(
                            lastSenhas[t].divison === filas[i].fila[s].divison &&
                            lastSenhas[t].senha === filas[i].fila[s].senha
                        ) status = true;
                    }
                    if (!status){
                        let last = lastSenhas;
                        if (lastSenhas.length === 0)
                            last[lastSenhas.length] = filas[i].fila[s];
                        else{
                            for(let l=lastSenhas.length; l>0; l--){
                                last[l] = last[l-1];
                            }
                            last[0] = filas[i].fila[s];
                        }
                        setLastSenhas(last);
                        /*let last = [...lastSenhas];
                        last.unshift(filas[i].fila[s]);
                        setLastSenhas(last.slice(0, 10)); */
                    }
                }
            }
        if (chamado) break;
        }
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

    return (
        <>
            <div className="container-fluid app">
                <div className="row">
                    <div className="z1 col-3 app bg1 d-flex flex-column justify-content-between">
                        <div className="w-100 px-3 pe-4 my-4">
                            <img className="w-100" src={logo} alt="Prefeitura Municipal de Parobé"/>    
                        </div>
                        <div className="bg4 mt-4 rounded-5">
                            <p className="tx1 fs-1 fw-bold text-center mt-2 mb-0 d-flex align-items-center justify-content-center">{senha.divison}{senha.senha} <span className={`ms-2 fs-4 up ${prioridade}`}>({senha.tipo})</span></p>
                            <p className="tx1 fs-2 text-center">{local}</p>
                        </div>
                        <div className="mb-3 d-flex flex-column align-items-center">
                            <p className="fs-4 mb-2 text-white text-center">{formatarData(dataHoraAtual)}</p>
                            <hr className="m-0 border border-white w-75"></hr>
                            <p className="fs-1 fw-bold my-0 text-white text-center">{formatarHora(dataHoraAtual)}</p>
                        </div>
                    </div>
                    <Midia link={`https://www.youtube.com/embed/${midia}`}/>
                    <div className="z2 col-12 position-absolute p-5 bg1 bottom-0">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-3">

                                </div>
                                <div className="col-9 d-flex justify-content-around">
                                    {
                                        lastSenhas.map((item, index) => {
                                            if(index < 5){
                                                return (
                                                    <p key={index} className="text-white m-0 d-inline fw-bold">&nbsp;{item.divison}{item.senha} - {item.tipo}</p>
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
        </>
    )
}

export default Painel