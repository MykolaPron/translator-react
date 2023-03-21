import React, {useEffect, useState} from "react";

import {useParams} from "react-router-dom";
import {TranslationModel} from "../shared/models/TranslationModel";
import {translationTable} from "../services/StorageService/translationTable";
import {translationToGroupTable, TTranslationToGroupTable} from "../services/StorageService/translationToGroupTable";
import ModalAddTranslationFromList from "./_group/ModalAddTranslationFromList";
import ModalAddTranslationNew from "./_group/ModalAddTranslationNew";

export type TDataType = TTranslationToGroupTable & { translation: TranslationModel }
const GroupViewPage = () => {

    const {groupId} = useParams();

    const [data, setData] = useState<TDataType[]>([])
    const [isNew, setIsNew] = useState(false)
    const [isOpen, setIsOpen] = useState(false)


    const fetch = () => {
        const translationToGroupList = translationToGroupTable.getAll({query: {groupId: Number(groupId)}})
        const temp = translationToGroupList.map(item => {
            const translation = translationTable.getById(item.translationId)
            return {...item, translation}
        })
        setData(temp)
    }

    useEffect(() => {
        fetch()
    }, [])


    const removeHandler = (translationToGroupId: number) => () => {
        const isConfirmed = confirm('Remove translation from this Group?')
        if (isConfirmed) {
            translationToGroupTable.deleteById(translationToGroupId)
            fetch()
        }
    }

    const modalFromListSubmitHandler = () => {
        fetch()
        setIsOpen(false)
    }
    const modalFromListCloseHandler = () => {
        setIsOpen(false)
    }

    return (
        <div>
            <h2>Group View Page</h2>
            <h3>Translations ({data.length})</h3>
            <label>
                is New
                <input type="checkbox" checked={!isNew} onChange={() => {
                    setIsNew(prevState => !prevState)
                }}/>
            </label>
            <button onClick={() => {
                setIsOpen(true)
            }}>Add
            </button>
            {
                isNew
                    ? <ModalAddTranslationFromList
                        open={isOpen}
                        groupId={Number(groupId)}
                        translationList={data}
                        onSubmit={modalFromListSubmitHandler}
                        onClose={modalFromListCloseHandler}
                    />
                    : <ModalAddTranslationNew
                        open={isOpen}
                        groupId={Number(groupId)}
                        onSubmit={modalFromListSubmitHandler}
                        onClose={modalFromListCloseHandler}
                    />
            }

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
