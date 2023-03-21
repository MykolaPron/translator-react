import React, {useEffect, useState} from "react";

import Modal from "../components/Modal";
import {useParams} from "react-router-dom";
import {TranslationModel} from "../shared/models/TranslationModel";
import {translationTable} from "../services/StorageService/translationTable";
import {translationToGroupTable, TTranslationToGroupTable} from "../services/StorageService/translationToGroupTable";

type TDataType = TTranslationToGroupTable & { translation: TranslationModel }
const selectedDefault = ['']
const GroupViewPage = () => {

    const {groupId} = useParams();

    const [data, setData] = useState<TDataType[]>([])
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(selectedDefault)

    const translationList = translationTable.getAll()

    const fetch = () => {
        const translationToGroupList = translationToGroupTable.getAll({query: {groupId: Number(groupId)}})
        const temp = translationToGroupList.map(item => {
            return {...item, translation: translationList.find(e => e.ID === item.translationId)}
        })
        // @ts-ignore
        setData(temp)
    }

    useEffect(() => {
        fetch()
    }, [])


    const submitFormHandle = () => {
        if (selected.some(e => e === '')) {
            alert('Bad option')
        }
        selected.forEach(e => {
            const newItem = {groupId: Number(groupId), translationId: +e}
            const exist = !!translationToGroupTable.getAll({query: newItem}).length
            if (!exist) {
                translationToGroupTable.add(newItem)
            }
        })
        fetch()
        setOpen(false)
        setSelected(selectedDefault)
    }
    const removeHandler = (translationToGroupId: number) => () => {
        const isConfirmed = confirm('Remove translation from this Group?')
        if (isConfirmed) {
            translationToGroupTable.deleteById(translationToGroupId)
            fetch()
        }
    }

    const closeModalHandler = () => {
        setOpen(false)
        setSelected(selectedDefault)
    }
    return (
        <div>
            <h2>Group View Page</h2>
            <h3>Translations ({data.length})</h3>
            <button onClick={() => {
                setOpen(true)
            }}>Add
            </button>
            <Modal open={open} onClose={closeModalHandler}>
                <select
                    multiple
                    value={selected}
                    onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions).map(e => e.value)
                        if (selectedOptions.some(e => e === '')) {
                            setSelected(selectedDefault)
                        } else {
                            setSelected(selectedOptions)
                        }
                    }}
                >
                    <option value="">-- Select --</option>
                    {translationList.map(translation => <option
                        key={translation.ID}
                        value={translation.ID}
                        disabled={data.some(e => e.translationId === translation.ID)
                        }>
                        {translation.source} - [{translation.transcription}] - {translation.translation}
                    </option>)}
                </select>
                <button onClick={submitFormHandle}>Submit</button>
            </Modal>
            <ul>
                {data.map(e => {
                    return (<li key={e.ID}>
                        {e.translation.source} - [{e.translation.transcription}] - {e.translation.translation}
                        <button onClick={removeHandler(e.ID)}>Remove</button>
                    </li>)
                })}
            </ul>
        </div>
    )
}

export default GroupViewPage
