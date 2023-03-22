import React, {forwardRef} from "react";

interface IBaseInputProps {
    label: string
    value: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const BaseInput = forwardRef<HTMLInputElement, IBaseInputProps>((props, ref) => {
    const elId = props.label.replace(' ','-').toLowerCase()

    return(
        <>
            <label htmlFor={elId}>{props.label}</label>
            <input id={elId} type="text" value={props.value}
                   onChange={props.onChange}
                   ref={ref}
            />
        </>
    )
})

export default BaseInput
