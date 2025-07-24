import { useState, useEffect } from "react"

function Erro (props){

    const [ erros, setErros ] = useState([]);

    useEffect(() => {
        setErros(props.erro)
        setTimeout(() => {setErros([])}, 5000);
    }, [props.erro]);

    return (
        <>
            {
                erros.map((erro, index) => {

                    return (
                        <div className="bg3 position-absolute z1 w-100 text-white p-4 rounded-3 mb-1">
                            {erro}
                        </div>
                    )
                })
            }
        </>
    )

}

export default Erro