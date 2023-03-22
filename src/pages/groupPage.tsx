import React, {useEffect, useState} from "react";
import Modal from "../components/Modal";
import {Link} from "react-router-dom";
import {groupTable, TGroupTable} from "../services/StorageService/groupTable";
import {GroupModel} from "../shared/models/GroupModel";

const initialGroupData = {
    name: '',
    description: ''
}

const GroupPage = () => {
    const [edit, setEdit] = useState(0)

    const [open, setOpen] = useState(false)
    const [data, setData] = useState<TGroupTable[]>([])
    const [group, setGroup] = useState<GroupModel>(initialGroupData)

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
            setGroup(initialGroupData)
        }
    }
    const submitFormHandle = () => {
        const isConfirmed = confirm(`Are you sure you want to ${edit ? 'create' : 'edit'} record?`)
        if (!isConfirmed) return;

        if (edit) {
            // edit
            groupTable.updateById(edit, group)
        } else {
            //create
            groupTable.add(group)
        }
        fetchData()
        setOpen(false)
        setEdit(0)
        setGroup(initialGroupData)
    }
    const editHandle = (id: number) => () => {
        const {name, description} = groupTable.getById(id)
        setGroup({name, description})
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
                    <label>Name
                        <input type="text" value={group.name} onChange={(e) => {
                            setGroup(prevState => ({...prevState, name: e.target.value}))
                        }}/>
                    </label>
                    <label>Description
                        <textarea
                            value={group.description}
                            onChange={(e) => {
                                setGroup(prevState => ({...prevState, description: e.target.value}))
                            }}
                        >
                        </textarea>
                    </label>
                </div>
                <button onClick={submitFormHandle}>Submit</button>
            </Modal>
            <ul>
                {
                    [...data].reverse().map((e) => <li
                        key={e.ID}
                        // style={{display: 'flex', gap: '1rem'}}
                    >
                        <div>
                            {e.name}
                            <Link to={`${e.ID}/view`}>
                                <button>View</button>
                            </Link>
                            <button onClick={editHandle(e.ID)}>Edit</button>
                            <button onClick={deleteHandle(e.ID)}>Delete</button>
                        </div>
                        <div>{e.description}</div>
                    </li>)
                }
            </ul>
        </div>
    )
}

export default GroupPage
