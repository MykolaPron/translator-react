import React, {useEffect, useState} from "react";
import Modal from "../components/Modal";
import { Link } from "react-router-dom";
import {groupTable, TGroupTable} from "../services/StorageService/groupTable";

const GroupPage = () => {
    const [edit, setEdit] = useState(0)

    const [open, setOpen] = useState(false)
    const [data, setData] = useState<TGroupTable[]>([])
    const [group, setGroup] = useState('')

    const fetchData = () => {
        const res = groupTable.getAll()
        setData(res)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const openModalCreateHandler = () => {
        setOpen(true)
    }
    const closeModalHandle = () => {
        const isConfirmed = confirm('Data is not stored. Are you sure you want to close the window?')
        if (isConfirmed) {
            setOpen(false)
            setGroup('')
        }
    }
    const submitFormHandle = () => {
        const isConfirmed = confirm(`Are you sure you want to ${edit ? 'create' : 'edit'} record?`)
        if (!isConfirmed) return;

        if (edit) {
            // edit
            groupTable.updateById(edit, {name: group})
        } else {
            //create
            groupTable.add({name: group})
        }
        fetchData()
        setOpen(false)
        setEdit(0)
        setGroup('')
    }
    const editHandle = (id: number) => () => {
        const {name} = groupTable.getById(id)
        setGroup(name)
        setEdit(id)
        setOpen(true)
    }
    const deleteHandle = (id: number) => () => {
        const isConfirmed = confirm(`Are you sure you want to delete record?`)
        if (isConfirmed) {
            groupTable.deleteById(id)
            fetchData()
        }
    }

    return (
        <div>
            <h2>Group Page ({data.length})</h2>
            <button onClick={openModalCreateHandler}>Create</button>
            <Modal open={open} onClose={closeModalHandle}>
                <div>
                    <label htmlFor="groupName">Name</label>
                    <input id="groupName" type="text" value={group} onChange={(e) => {
                        setGroup(e.target.value)
                    }}/>
                </div>
                <button onClick={submitFormHandle}>Submit</button>
            </Modal>
            <ul>
                {
                    data.map((e) => <li
                        key={e.ID}
                        style={{display: 'flex', gap: '1rem'}}
                    >
                        <Link to={`${e.ID}/view`} state={12}>
                            {e.name}
                        </Link>
                        <button onClick={editHandle(e.ID)}>Edit</button>
                        <button onClick={deleteHandle(e.ID)}>Delete</button>
                    </li>)
                }
            </ul>
        </div>
    )
}

export default GroupPage
