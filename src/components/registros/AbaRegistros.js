import axios from "axios";
import Header from "../Header"
import Erro from "../Erro"

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const AbaRegistros = () => {
    
    const url = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}`;

    const [ user, setUser ] = useState(undefined)
    const [ listaRegistros, setListaRegistros ] = useState([])
    const [ locais, setLocais ] = useState([]);
    const [ erros, setErros ] = useState([]);
    const { id } = useParams();

    //

    const [ filtroLocal, setFiltroLocal ] = useState("")
    const [ somaRegistrosUnidade, setSomaRegistrosUnidade ] = useState(0)

    const [ filtroYear, setFiltroYear ] = useState("")
    const [ mediaRegistrosYear, setMediaRegistrosYear] = useState("")
    const [ somaRegistrosYear, setSomaRegistrosYear] = useState("")
    const [ mesDestaqueYear, setMesDestaqueYear] = useState("")

    const [ filtroMonth, setFiltroMonth ] = useState("")
    const [ mediaRegistrosMonth, setMediaRegistrosMonth ] = useState("")
    const [ somaRegistrosMonth, setSomaRegistrosMonth] = useState("")
    const [ dayDestaqueMonth, setDayDestaqueMonth] = useState("")

    const [ registrosDays, setRegistrosDay ] = useState([])

    function setYear (media, soma, destaque){
        setMediaRegistrosYear(media)
        setSomaRegistrosYear(soma)
        setMesDestaqueYear(destaque)
    }
    function setMonth (media, soma, destaque){
        setMediaRegistrosMonth(media)
        setSomaRegistrosMonth(soma)
        setDayDestaqueMonth(destaque)
    }

    //
    
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
                    
                }).then((resp) => {
                    if (resp.data.status)
                        setLocais(resp.data.data);
                    else{
                        setErros(resp.data.msg);
                    }
                }).catch((error) => {
                    setErros(["Erro ao listar locais"])
                })    
            } dados();

            const interval = setInterval(dados, 10000);

            return () => clearInterval(interval);    
        }
    }, [id, user, url])
    
    useEffect(() => {
        let registros = []
        let newSomaRegistrosUnidade = 0

        locais.forEach((local, index) => {
            registros.push({name:local.name, years:[]})

            let indexYear = -1
            let indexmonth = -1
            local.Registros.forEach((registro) => {
                let data = new Date(registro.data)

                //Ano
                let newYear = data.getFullYear()
                let verifyYear = true
                for (let v=0; v < registros[index].years.length; v++ ){
                    if (registros[index].years[v].year == newYear)
                        verifyYear = false
                }
                if (verifyYear){
                    registros[index].years.push({year:newYear, months:[]})
                    indexYear++
                }

                //Mês
                let newMonth = data.getMonth() + 1
                let verifyMonth = true
                for (let v=0; v < registros[index].years[indexYear].months.length; v++ ){
                    if (registros[index].years[indexYear].months[v].month == newMonth)
                        verifyMonth = false
                }
                if (verifyMonth){
                    registros[index].years[indexYear].months.push({month:newMonth, days:[]})
                    indexmonth++
                }
                
                //Dia
                registros[index].years[indexYear].months[indexmonth].days.push({
                    day: data.getDate() + 1,
                    count: registro.numRegistros
                })

                //total da Unidade
                newSomaRegistrosUnidade += registro.numRegistros
            })
        })

        setSomaRegistrosUnidade(newSomaRegistrosUnidade)
        setListaRegistros(registros)
    }, [locais])

    return (
        <>
            <Header back="link"></Header>
            <Erro erro={erros}/>
            
            <div className="py-5 px-2 px-lg-5 mb-5 relative">
                <p className="md:absolute right-0 text-center pb-4 md:pr-5 md:pt-3 top-0 font-bold">Total de Registros da Unidade: {somaRegistrosUnidade} senhas</p>  
                {/*Local*/}
                <div className="mb-5">
                    <div className="flex scroll3">
                        {
                            listaRegistros.map((local, index) => {

                                return (
                                    <label key={index} className="flex">
                                        <button
                                            type="radio"
                                            name="local"
                                            value={local.name}
                                            checked={filtroLocal === local.name}
                                            className={`mx-3 text-lg py-1 ho1 ${(local.name === filtroLocal) ? "px-4 bg1 rounded-3xl text-white font-bold" : ""}`}
                                            onClick={(e) => {if(local.name != filtroLocal){
                                                setFiltroYear(""); 
                                                setFiltroMonth("")}; 
                                                setFiltroLocal(e.target.value)
                                                setMediaRegistrosYear("")
                                                setSomaRegistrosYear("")
                                                setMesDestaqueYear("")
                                                setMediaRegistrosMonth("")
                                                setSomaRegistrosMonth("")
                                                setDayDestaqueMonth("")
                                                setRegistrosDay([])
                                            }}
                                        >
                                            {local.name}
                                        </button>
                                        {
                                            index + 1 < listaRegistros.length && (
                                                <div className="by-3 border-2 rounded-xl"></div>
                                            )
                                        }
                                    </label>
                                )
                            })
                        }   
                    </div>  
                    <hr className="mt-2 border-5 opacity-10"></hr> 
                </div>

                {/*Ano*/}
                <div className="w-full bg12 shadow-lg p-4 rounded-3xl mt-3 pb-5 mb-5">
                    <div className="mt-2 mb-5">
                        <div className="flex scroll3">
                            {
                                listaRegistros.map((local, index) => {

                                    return local.years.map((year, indexYear) => {

                                        let newSomaRegistrosYear = 0
                                        let newMediaRegistrosYear = 0
                                        let newMesDestaqueYear = 0

                                        //

                                        if (filtroLocal == "" && index == 0) return (
                                            <p>Escolha um local</p>
                                        )
                                        
                                        if (local.name != filtroLocal) return

                                        //
                                        
                                        for(let m=0; m <  year.months.length; m++ ){
                                            let mesCount = 0
                                            for(let d=0; d < year.months[m].days.length; d++){
                                                newSomaRegistrosYear += year.months[m].days[d].count
                                                mesCount += year.months[m].days[d].count
                                            }
                                            if (mesCount > newMesDestaqueYear)
                                                newMesDestaqueYear = mesCount
                                        }
                                        newMediaRegistrosYear = newSomaRegistrosYear / year.months.length
                                        newMediaRegistrosYear = Math.round(newMediaRegistrosYear)

                                        return (
                                            <label key={indexYear} className="flex">
                                                <button
                                                    type="radio"
                                                    name="year"
                                                    value={year.year}
                                                    checked={filtroYear === year.year}
                                                    className={`mx-3 text-md py-1 ho1 ${(year.year == filtroYear) ? "px-4 bg2 rounded-3xl text-white font-bold" : ""}`}
                                                    onClick={(e) => {
                                                        setFiltroYear(e.target.value); 
                                                        if(filtroYear != year.year){
                                                            setFiltroMonth("")
                                                            setMediaRegistrosMonth("")
                                                            setSomaRegistrosMonth("")
                                                            setDayDestaqueMonth("")
                                                            setRegistrosDay([])
                                                        }
                                                        setYear(newMediaRegistrosYear, newSomaRegistrosYear, newMesDestaqueYear)
                                                    }}
                                                >
                                                    {year.year}
                                                </button>
                                                {
                                                    indexYear + 1 < local.years.length && (
                                                        <div className="by-3 border-2 rounded-xl"></div>
                                                    )
                                                }
                                            </label>
                                        )    
                                    })
                                })
                            }   
                        </div>    
                        <hr className="mt-2 border-5 opacity-10"></hr> 
                    </div>

                    <div className="lg:flex">
                        <div className="flex-1 px-3 my-1 lg:m-0">
                            <div className="card1 rounded-xl flex flex-column items-center p-3 shadow-sm">
                                <p className="text-3xl">
                                    {somaRegistrosYear}
                                </p>
                                Total de Senhas
                            </div>   
                        </div>
                        <div className="flex-1 px-3 my-1 lg:m-0">
                            <div className="card2 rounded-xl flex flex-column items-center p-3 shadow-sm">
                                <p className="text-3xl">
                                    {mediaRegistrosYear}
                                </p>
                                Media por Mês
                            </div>   
                        </div>
                        <div className="flex-1 px-3 my-1 lg:m-0">
                            <div className="card3 rounded-xl flex flex-column items-center p-3 shadow-sm">
                                <p className="text-3xl">
                                    {mesDestaqueYear}
                                </p>
                                Mês de Destaque
                            </div>   
                        </div>
                    </div>
                    
                </div>

                {/*Mês*/}
                <div className="w-full bg12 shadow-lg p-4 rounded-3xl mt-3">
                    <div className="mt-2 mb-5">
                        <div className="flex scroll3">
                            {
                                listaRegistros.map((local, index) => {
                                    return local.years.map((year, indexYear) => {
                                        
                                        if (filtroLocal == "" && index == 0) return (
                                            <p>Escolha um local e um ano</p>
                                        )

                                        if (filtroLocal != "" && filtroYear == "" && index == 0) return (
                                            <p>Escolha um ano</p>
                                        )

                                        if (local.name != filtroLocal) return

                                        return year.months.map((month, indexMonth) => {

                                            let newSomaRegistrosMonth = 0
                                            let newMediaRegistrosMonth = 0
                                            let newDayDestaqueMonth = 0

                                            //

                                            if (year.year != filtroYear) return

                                            //
                                        
                                            for(let d=0; d <  month.days.length; d++ ){
                                                let dayCount = month.days[d].count
                                                newSomaRegistrosMonth += month.days[d].count
                                                if (dayCount > newDayDestaqueMonth)
                                                    newDayDestaqueMonth = dayCount
                                            }
                                            newMediaRegistrosMonth = newSomaRegistrosMonth / month.days.length
                                            newMediaRegistrosMonth = Math.round(newMediaRegistrosMonth)

                                            return (
                                                <label key={indexMonth} className="flex">
                                                    <button
                                                        type="radio"
                                                        name="month"
                                                        value={month.month}
                                                        checked={filtroMonth === month.month}
                                                        className={`mx-3 text-md py-1 ho1 ${(month.month == filtroMonth) ? "px-4 bg2 rounded-3xl text-white font-bold" : ""}`}
                                                        onClick={(e) => {
                                                            setFiltroMonth(e.target.value)
                                                            setMonth(newMediaRegistrosMonth, newSomaRegistrosMonth, newDayDestaqueMonth)
                                                            setRegistrosDay(month.days)
                                                        }}
                                                    >
                                                        {month.month}
                                                    </button>
                                                    {
                                                        indexMonth + 1 < year.months.length && (
                                                            <div className="by-3 border-2 rounded-xl"></div>
                                                        )
                                                    }
                                                </label>
                                            ) 
                                        }) 
                                    })
                                })
                            }   
                        </div>    
                        <hr className="mt-2 border-5 opacity-10"></hr> 
                    </div>
                    
                    <div className="lg:flex">
                        <div className="flex-1 px-3 my-1 lg:m-0">
                            <div className="card1 rounded-xl flex flex-column items-center p-3 shadow-sm">
                                <p className="text-3xl">
                                    {somaRegistrosMonth}
                                </p>
                                Total de Senhas
                            </div>   
                        </div>
                        <div className="flex-1 px-3 my-1 lg:m-0">
                            <div className="card2 rounded-xl flex flex-column items-center p-3 shadow-sm">
                                <p className="text-3xl">
                                    {mediaRegistrosMonth}
                                </p>
                                Media por Dia
                            </div>   
                        </div>
                        <div className="flex-1 px-3 my-1 lg:m-0">
                            <div className="card3 rounded-xl flex flex-column items-center p-3 shadow-sm">
                                <p className="text-3xl">
                                    {dayDestaqueMonth}
                                </p>
                                Dia de Destaque
                            </div>   
                        </div>
                    </div>

                    {
                        registrosDays.length > 0 && (
                            <h2 className="text-center text-xl font-bold mt-4">Total de senhas por dia</h2>
                        )       
                    }

                    <div className="lg:flex flex-wrap my-4">
                        {
                            registrosDays.map((day, index) => {

                                return (
                                    <div className="w-25 px-2">
                                        <div className="shadow-sm rounded-xl flex py-2 justify-between px-4 bg11 my-1">
                                            <p className="tx2 font-bold">
                                                {String(day.day - 1).padStart(2, '0')}/{String(filtroMonth).padStart(2, '0')}/{filtroYear}
                                            </p>
                                            <p className="font-bold">
                                                {day.count}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default AbaRegistros