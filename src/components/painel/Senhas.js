import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";

import som1 from "../../assets/som/som1.mp3"
//import som2 from "../../assets/som/som2.mp3"
//import som3 from "../../assets/som/som3.mp3"

function Senhas (props){

    const audio = new Audio(som1);
    const [ senha, setSenha ] = useState({});
    const [ prioridade, setPrioridade ] = useState("text-success-emphasis d-none")
    const [ prioridade2, setPrioridade2 ] = useState("text-success-emphasis")
    const [ color, setColor] = useState("bg4")
    const [ colorText, setColorText ] = useState("tx1")

    async function funChamar(fila){

        for(let s=0; s<fila.length; s++){
            if (fila[s].chamado === true && fila[s].atendido === false){
                if(props.local == "ESTADO")
                    setColor("bg44")

                if (fila[s].sublocal === "none"){
                    fila[s].sublocal = "";
                }
                setSenha(fila[s]);
                if(fila[s].tipo === "normal"){
                    setPrioridade("text-success-emphasis d-none")
                    setColorText("tx1")
                    if(props.local == "ESTADO"){
                        setColor("bg44")
                        setColorText("tx3")
                    }
                } else{
                    setPrioridade("text-danger")
                    setColorText("text-danger")
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
                        lastSenhas[t].division === fila.fila[s].division &&
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

    if(! senha.tipo) return

    return (
        <>
            <div className="h-50 flex flex-column">
                <div>
                <p className="font-bold text-[50px] mt-3 text-center">{props.local}</p>

                </div>
                <div className={` ${color} flex-auto m-5 mt-3 flex justify-center `}>
                    <div className="flex items-center justify-center">
                        <p className={`${colorText} m-0 pr-2 font-medium text-[180px]`} >{senha.division}{senha.senha} </p>
                        <p className={`tx2 m-0 text-[70px] pr-2 ${prioridade}`} >{senha.tipo}</p>
                        <p className={`${colorText} font-bold text-[70px]`}>{senha.sublocal}</p>       
                    </div>
                </div>
            </div>
        </>
    )
}

export default Senhas;