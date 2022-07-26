import { useEffect, useRef, useState } from "react"

const useImageLoaded = () => {
    const [loaded, setLoaded] = useState(false)
    const ref = useRef()
    
    const onLoad = () => {
        setLoaded(true)
    }

    useEffect(() => {
        if (ref.current && ref.current.complete) {
            onLoad()
        }
    })

    return [ref, loaded, onLoad]
}

export const ImageOnLoad = ({ src, className, alt, keyValue }) => {
    const [ref, loaded, onLoad] = useImageLoaded()

    return (
        <>
            {loaded ?
                <img src={src} alt={alt} className={className} key={keyValue} />
                :
                <div className={'image_preloader'}>
                    <img ref={ref} onLoad={onLoad} src={src} alt={alt} className={'dislpay_none'} key={keyValue} />
                </div>

            }


        </>

    )
}