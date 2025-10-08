import { useState, useEffect } from "react"

function Midia (props){

    const [ resolusaoH, setResolusaoH ] = useState("d-md-flex")
    const [ resolusaoV, setResolusaoV ] = useState("d-none")

     useEffect(() => {
            if (window.innerWidth < window.innerHeight){
                setResolusaoH("d-none")
                setResolusaoV("d-flex")
            }
        }, []);

    return (
        <>
            <div className={`${resolusaoH} col-md-8 col-lg-9 p-0`}>
                <iframe id="video" src={props.link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
            <div className={`${resolusaoV} col-12 p-0`}>
                <iframe id="video2" src={props.link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
        </>
    )
}

export default Midia