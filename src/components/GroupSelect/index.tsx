import React, {useEffect, useState} from "react";
import {groupTable, TGroupTable} from "../../services/StorageService/groupTable";

interface IGroupSelectProps {
    onChange?: (groups: TGroupTable[]) => void
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
            const groups = list.filter(e=> selectedIds.includes(`${e.ID}`))

            props.onChange(groups)
        }
    }

    return (
        <div>
            <label>
                Group
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
