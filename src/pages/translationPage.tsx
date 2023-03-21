import React, {useEffect, useState} from "react";

import {TranslationModel} from "../shared/models/TranslationModel";
import Modal from "../components/Modal";
import TranslationInputs from "../components/TranslationInputs";
import {translationTable, TTranslationTable} from "../services/StorageService/translationTable";

const initialNewItemData = {
    source: '',
    transcription: '',
    translation: ''
}
const TranslationPage = () => {
    const [edit, setEdit] = useState(0)
    const [open, setOpen] = useState(false)
    const [newItem, setNewItem] = useState<TranslationModel>(initialNewItemData)
    const [data, setData] = useState<TTranslationTable[]>([])

    const fetchData = () => {
        const res = translationTable.getAll()
        setData(res)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const editHandle = (id: number) => () => {
        const {source, transcription, translation} = translationTable.getById(id)
        setNewItem({source, transcription, translation})
        setEdit(id)
        setOpen(true)
    }

    const deleteHandle = (id: number) => () => {
        const isConfirmed = confirm(`Are you sure you want to delete record?`)
        if (isConfirmed) {
            translationTable.deleteById(id)
            fetchData()
        }
    }
    const closeModalHandle = () => {
        const isConfirmed = confirm('Data is not stored. Are you sure you want to close the window?')
        if (isConfirmed) {
            setOpen(false)
            setNewItem(initialNewItemData)
        }
    }

    const translationChangedHandler = (d: TranslationModel) => {
        setNewItem(d)
    }
    const submitFormHandle = () => {
        const isConfirmed = confirm(`Are you sure you want to ${edit ? 'create' : 'edit'} record?`)
        if (!isConfirmed) return;

        if (edit) {
            // edit
            translationTable.updateById(edit, newItem)
        } else {
            //create
            translationTable.add(newItem)
        }

        setNewItem(initialNewItemData)
        fetchData()
        setOpen(false)
        setEdit(0)
    }

    const openModalCreateHandler = () => {
        setNewItem(initialNewItemData)
        setEdit(0)
        setOpen(true)
    }

    return (
        <div>
            <h2>Translation List Page ({data.length})</h2>
            <button onClick={openModalCreateHandler}>Create</button>
            <Modal open={open} onClose={closeModalHandle}>
                <TranslationInputs
                    initialState={newItem}
                    onChange={translationChangedHandler}
                />
                <button onClick={submitFormHandle}>Submit</button>
            </Modal>
            <ul>
                {
                    data.map((e) => <li
                        key={e.ID}
                        style={{display: 'flex', gap: '1rem'}}
                    >
                        {e.source} - [{e.transcription}] - {e.translation}
                        <button onClick={editHandle(e.ID)}>Edit</button>
                        <button onClick={deleteHandle(e.ID)}>Delete</button>
                    </li>)
                }
            </ul>
        </div>
    )
}

export default TranslationPage
