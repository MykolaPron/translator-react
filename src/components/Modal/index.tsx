import React, {useEffect} from "react";

interface IModalProps {
    open?: boolean
    children: React.ReactNode
    onClose?: () => void
}

const Modal: React.FC<IModalProps> = ({open, children, onClose}) => {
    useEffect(()=>{
        document.body.style.overflow = open ? "hidden" : "";
    }, [open])

    const outAreaHandel = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onClose !== undefined && onClose();
    }

    return (
        <div style={{
            position: 'absolute',
            height: '100vh',
            width: '100vw',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '100',
            backgroundColor: '#00000050',
            backdropFilter: 'blur(5px)',

            display: open ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center'
        }}
             onClick={outAreaHandel}
        >
            <div style={{
                position: "relative",
                minWidth: '200px',
                minHeight: '100px',
                backgroundColor: "#ffffff"
            }}
                 onClick={(e) => {
                     e.stopPropagation()
                 }}
            >
                {children}
            </div>
        </div>
    )
}

export default Modal
