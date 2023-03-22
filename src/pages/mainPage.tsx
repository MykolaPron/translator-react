import React, {useCallback, useState} from "react";
import {translationTable, TTranslationTable} from "../services/StorageService/translationTable";
import {debounce, isLatinString} from "../shared/utills";

const MainPage = () => {
    const [searchInTranslation, setSearchInTranslation] = useState('')
    const [list, setList] = useState<TTranslationTable[]>([])

    const [isLatin, setIsLatin] = useState(true)
    const [disabledAdd, setDisabledAdd] = useState(true)

    const findTranslation = (str: string) => {
        const search = str.trim().toLowerCase()

        const temp = translationTable.getAll({
            query: ({source, translation}: TTranslationTable) => {
                const sourceMod = source.trim().toLowerCase()
                const translationMod = translation.trim().toLowerCase()

                return (search !== '')
                    && ((sourceMod === search) || ((new RegExp(search)).test(sourceMod))
                        || (translationMod === search) || ((new RegExp(search)).test(translationMod))
                    )
            }
        })
        setList(temp)
        setDisabledAdd(!!temp.length)
    }

    const findTranslationDeb = useCallback(debounce(findTranslation, 200), [])

    const selectedLangStyle = {fontWeight: 800, textDecoration: 'underline'}
    const engLabel = isLatin ? selectedLangStyle : {}
    const ukLabel = !isLatin ? selectedLangStyle : {}

    const getContent = (str: string) => {
        const doc = `<span style="color: red!important;">${searchInTranslation}</span>`

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

    return (
        <div>
            <h2>Main Page</h2>
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
                        }}
                        onKeyUp={() => {
                            findTranslationDeb(searchInTranslation)
                        }}
                    />
                    <button disabled={disabledAdd}>Add</button>
                </label>
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
