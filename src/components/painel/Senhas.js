import { useState, useEffect } from "react"

import som1 from "../../assets/som/som1.mp3"
//import som2 from "../../assets/som/som2.mp3"
//import som3 from "../../assets/som/som3.mp3"

function Senhas (props){

    const audio = new Audio(som1);
    const [ senha, setSenha ] = useState({});
    const [ local, setLocal ] = useState("")
    const [ prioridade, setPrioridade ] = useState("text-success-emphasis d-none")
    const [ prioridade2, setPrioridade2 ] = useState("text-success-emphasis")

    async function funChamar(fila){
        for(let s=0; s<fila.fila.length; s++){
            if (fila.fila[s].chamado === true && fila.fila[s].atendido === false){
                setLocal(fila.name)
                if (fila.fila[s].sublocal === "none"){
                    fila.fila[s].sublocal = "";
                }
                setSenha(fila.fila[s]);
                if(fila.fila[s].tipo === "normal"){
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
            /*else if (fila.fila[s].atendido === true){
                let status = false;
                for (let t=0; t<lastSenhas.length; t++){
                    if(
                        lastSenhas[t].divison === fila.fila[s].divison &&
                        lastSenhas[t].senha === fila.fila[s].senha
                    ) status = true;
                }
                if (!status){
                    let last = lastSenhas;
                    if (lastSenhas.length === 0)
                        last[lastSenhas.length] = fila.fila[s];
                    else{
                        for(let l=lastSenhas.length; l>0; l--){
                            last[l] = last[l-1];
                        }
                        last[0] = fila.fila[s];
                    }
                    setLastSenhas(last);
                    /*let last = [...lastSenhas];
                    last.unshift(filas[i].fila[s]);
                    setLastSenhas(last.slice(0, 10)); */
                /*}
            }*/
        }
    }

    useEffect(() => {
        if (props.fila !== undefined)
            funChamar(props.fila)
    }, [props.fila])

    return (
        <>
            <div className="bg4 mt-4 rounded-5 d-inline-flex flex-column px-5 mx-4">
                <p className={`px-5 tx1 fw-bold text-center mt-1 mb-0 d-inline align-items-center justify-content-center ${prioridade2}`} style={{fontSize:160}}>{senha.divison}{senha.senha} </p>
                <p className={`ms-2 tx2 text-center mt-0 fs-2 up m-0 ${prioridade}`} >({senha.tipo})</p>
                <p className="fs-1 text-center fw-bold d-inline pb-3 mx-0">{local}{senha.sublocal}</p>    
            </div>
        </>
    )
}

export default Senhas;