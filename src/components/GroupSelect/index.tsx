import React, {useEffect, useState} from "react";
import {groupTable, TGroupTable} from "../../services/StorageService/groupTable";

interface IGroupSelectProps {
    onChange?: (groupIds: number[]) => void
}

const GroupSelect: React.FC<IGroupSelectProps> = (props) => {
    const [selected, setSelected] = useState<string[]>([])
    const [list, setList] = useState<TGroupTable[]>([])

    useEffect(() => {
        const data = groupTable.getAll()
        setList(data)
    }, [])

    const selectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions).map(e => e.value)
        const selectedIds = options.includes('') ? [''] : options

        setSelected(selectedIds)

        if(props.onChange){
            props.onChange(selectedIds.filter(e=>e !== '').map(e=> +e))
        }
    }

    return (
        <div>
            <label>
                <select
                    multiple
                    value={selected}
                    onChange={selectHandler}
                >
                    <option value="">-- Select --</option>
                    {list.map(({ID, name}) => {
                        return (
                            <option key={ID} value={ID}>{name}</option>
                        )
                    })}
                </select>
            </label>
        </div>
    )
}

export default GroupSelect
