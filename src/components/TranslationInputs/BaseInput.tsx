import React from "react";

interface IBaseInputProps {
    label: string
    value: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const BaseInput:React.FC<IBaseInputProps> = (props) => {
    const elId = props.label.replace(' ','-').toLowerCase()

    return(
        <>
            <label htmlFor={elId}>{props.label}</label>
            <input id={elId} type="text" value={props.value}
                   onChange={props.onChange}
            />
        </>
    )
}

export default BaseInput
