import React, {useState} from "react";
import Modal from "../../components/Modal";
import {translationToGroupTable} from "../../services/StorageService/translationToGroupTable";
import {translationTable} from "../../services/StorageService/translationTable";
import {TDataType} from "../groupViewPage";
const selectedDefault = ['']


interface IModalAddTranslationFromListProps {
    groupId: number
    translationList: TDataType[]
    onSubmit: () => void
    onClose: () => void
    open: boolean
}
const ModalAddTranslationFromList:React.FC<IModalAddTranslationFromListProps> = (props) =>{
    const {translationList, open, groupId,onSubmit, onClose} = props
    // const [isOpen, setIsOpen] = useState(open)
    const [selected, setSelected] = useState(selectedDefault)

    const submitFormHandle = () => {
        if (selected.some(e => e === '')) {
            alert('Bad option')
        }
        selected.forEach(e => {
            const newItem = {groupId, translationId: +e}
            const exist = !!translationToGroupTable.getAll({query: newItem}).length
            if (!exist) {
                translationToGroupTable.add(newItem)
            }
        })
        onSubmit()
        setSelected(selectedDefault)
    }
    const closeModalHandler = () => {
        onClose()
        setSelected(selectedDefault)
    }

    const translations = translationTable.getAll()

    return(
        <Modal open={open} onClose={closeModalHandler}>
            <select
                multiple
                value={selected}
                size={10}
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
                {translations.map(translation => <option
                    key={translation.ID}
                    value={translation.ID}
                    disabled={translationList.some(e => e.translationId === translation.ID)
                    }>
                    {translation.source} - [{translation.transcription}] - {translation.translation}
                </option>)}
            </select>
            <button onClick={submitFormHandle}>Submit</button>
        </Modal>
    )
}

export default ModalAddTranslationFromList
