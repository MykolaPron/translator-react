import React, {useCallback, useRef, useState} from "react";
import {translationTable, TTranslationTable} from "../services/StorageService/translationTable";
import {debounce, isLatinString} from "../shared/utills";
import Modal from "../components/Modal";
import TranslationInputs, {initialData} from "../components/TranslationInputs";
import GroupSelect from "../components/GroupSelect";
import {translationToGroupTable} from "../services/StorageService/translationToGroupTable";
import {TranslationToGroupModel} from "../shared/models/GroupModel";
import {TGroupTable} from "../services/StorageService/groupTable";

const MainPage = () => {
    const translationRef = useRef<HTMLDivElement>(null)
    const [translation, setTranslation] = useState(initialData)

    const [searchInTranslation, setSearchInTranslation] = useState('')
    const [list, setList] = useState<TTranslationTable[]>([])

    const [isLatin, setIsLatin] = useState(true)
    const [disabledAdd, setDisabledAdd] = useState(true)
    const [open, setOpen] = useState(false)
    const [groups, setGroups] = useState<TGroupTable[]>([])

    const findTranslation = (str: string) => {
        const allowedSymbols = new RegExp('[^a-zA-Z0-9А-ЩЬЮЯҐЄІЇа-щьюяґєії,:;\\-.?!\'\"\`\/ ]', 'g')
        const search = str.trim().toLowerCase().replace(allowedSymbols, "");

        const temp = translationTable.getAll({
            query: ({source, translation}: TTranslationTable) => {
                const sourceMod = source.trim().toLowerCase()
                const translationMod = translation.trim().toLowerCase()

                return (search !== '' && search !== '/')
                    && ((sourceMod === search) || ((new RegExp(search)).test(sourceMod))
                        || (translationMod === search) || ((new RegExp(search)).test(translationMod))
                    )
            }
        })
        setList(temp)

        setDisabledAdd(search.length < 2 || temp.some(e => e.source === search))
    }

    const findTranslationDeb = useCallback(debounce(findTranslation, 200), [])

    const selectedLangStyle = {fontWeight: 800, textDecoration: 'underline'}
    const engLabel = isLatin ? selectedLangStyle : {}
    const ukLabel = !isLatin ? selectedLangStyle : {}

    const getContent = (str: string) => {
        const doc = `<span style="color: red;text-decoration: underline;">${searchInTranslation}</span>`

        if (searchInTranslation === '') {
            return str
        } else {
            if (isLatin) {
                return isLatinString(str) ? str.replace(searchInTranslation, doc) : str
            } else {
                return isLatinString(str) ? str : str.replace(searchInTranslation, doc)
            }
        }
    }

    const openModal = () => {
        setTranslation(prevState => {
            const key = isLatin ? 'source' : 'translation'
            return {...prevState, [key]: searchInTranslation}
        })
        setOpen(true)
    }

    const submitModalHandler = () => {
        const isConfirmed = confirm(`Are you sure you want to create record?`)
        if (!isConfirmed) return;

        const translationId = translationTable.add(translation)
        if(groups.length){
            groups.forEach(group => {
                translationToGroupTable.add<TranslationToGroupModel>({groupId: group.ID, translationId})
            })
        }

        setTranslation(initialData)
        setOpen(false)
        setSearchInTranslation('')
        setList([])
        translationRef.current && translationRef.current.focus()
    }

    const groupChangeHandler = (groupIds: TGroupTable[]) => {
        // console.log(groupIds)
        setGroups(groupIds)
    }
    return (
        <div>
            <h2>Main Page</h2>
            <Modal
                open={open}
                onClose={() => {
                    setTranslation(initialData)
                    setOpen(false)
                }}
            >
                <GroupSelect onChange={groupChangeHandler}/>
                <TranslationInputs
                    initialState={translation}
                    onChange={(data) => {
                        setTranslation(data)
                    }}/>
                <button onClick={submitModalHandler}>Submit</button>
            </Modal>
            <div>
                <label>
                    Search in translation
                    (<span style={ukLabel}>UK</span> or <span style={engLabel}>EN</span>)
                    <input
                        autoFocus
                        type="text"
                        value={searchInTranslation}
                        onChange={(e) => {
                            setIsLatin(isLatinString(e.target.value))
                            setSearchInTranslation(e.target.value)
                            findTranslationDeb(e.target.value)
                        }}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                openModal()
                            }
                        }}
                    />
                    <button disabled={disabledAdd} onClick={() => {
                        openModal()
                    }}>Add
                    </button>
                </label>
                <div ref={translationRef}></div>
                <ul>
                    {[...list].reverse().map(({ID, source, transcription, translation}) =>
                        <li key={ID}>
                            <span dangerouslySetInnerHTML={{__html: getContent(source)}}></span>
                            <span> - [{transcription}] - </span>
                            <span dangerouslySetInnerHTML={{__html: getContent(translation)}}></span>
                        </li>)}
                </ul>
            </div>
        </div>
    )
}

export default MainPage
