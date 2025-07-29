
function Midia (props){

    return (
        <div className="d-none d-md-flex col-md-8 col-lg-9 p-0">
            <iframe id="video" src={props.link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
    )
}

export default Midia