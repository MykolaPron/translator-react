import React, {useState} from "react";
import Modal from "../../components/Modal";
import {translationToGroupTable} from "../../services/StorageService/translationToGroupTable";
import {translationTable} from "../../services/StorageService/translationTable";
import TranslationInputs from "../../components/TranslationInputs";
import {TranslationModel} from "../../shared/models/TranslationModel";
import {TranslationToGroupModel} from "../../shared/models/GroupModel";

const initialNewItemData = {
    source: '',
    transcription: '',
    translation: ''
}

interface IModalAddTranslationNewProps {
    groupId: number
    onSubmit: () => void
    onClose: () => void
    open: boolean
}

const ModalAddTranslationNew: React.FC<IModalAddTranslationNewProps> = (props) => {

    const {open, groupId, onSubmit, onClose} = props
    const [newItem, setNewItem] = useState<TranslationModel>(initialNewItemData)

    const submitFormHandle = () => {
        const isConfirmed = confirm(`Are you sure you want to create Translation record?`)
        if (!isConfirmed) return;

        const translationId = translationTable.add(newItem)
        translationToGroupTable.add<TranslationToGroupModel>({groupId, translationId})
        setNewItem(initialNewItemData)
        onSubmit()
    }
    const closeModalHandler = () => {
        setNewItem(initialNewItemData)
        onClose()
    }

    const translationChangedHandler = (d: TranslationModel) => {
        setNewItem(d)
    }
    return (
        <Modal open={open} onClose={closeModalHandler}>
            <TranslationInputs initialState={newItem} onChange={translationChangedHandler}/>
            <button onClick={submitFormHandle}>Submit</button>
        </Modal>
    )
}

export default ModalAddTranslationNew
