import React, {useEffect} from "react";
import BaseInput from "./BaseInput";
import {TranslationModel} from "../../shared/models/TranslationModel";
import {isLatinString} from "../../shared/utills";
import {getTranscription, getTranslation} from "../../services/TranslationService";

interface ITranslationInputsProps {
    initialState?: TranslationModel
    onChange?: (state: TranslationModel) => void
}

const processStr = '...'

const TranslationInputs: React.FC<ITranslationInputsProps> = ({initialState, onChange}) => {
    const [change, setChange] = React.useState(false)

    const [source, setSource] = React.useState('');
    const [transcription, setTranscription] = React.useState( '');
    const [translation, setTranslation] = React.useState( '');

    useEffect(() => {
        if(initialState){
            setSource(initialState.source)
            setTranscription(initialState.transcription)
            setTranslation(initialState.translation)
        }
    },[initialState])

    const sourceSearchHandler = async () => {
        if (!isLatinString(source)) {
            alert(`Source word "${source}" isn't LATIN word!!`)
            return;
        }
        setTranscription(processStr)
        setTranslation(processStr)

        const resTranslation = await getTranslation(source, {from: 'en', to: 'uk'})
        setTranslation(resTranslation)

        const resTranscription = await getTranscription(source)
        setTranscription(resTranscription)

        setChange(true)

    }

    const translationSearchHandler = async () => {
        if (isLatinString(translation)) {
            alert(`Source word "${translation}" is LATIN word!!`)
            return;
        }
        setTranscription(processStr)
        setSource(processStr)

        const resTranslation = await getTranslation(translation, {from: 'uk', to: 'en'})
        setSource(resTranslation)

        const resTranscription =await getTranscription(resTranslation)
        setTranscription(resTranscription)

        setChange(true)
    }

    React.useEffect(() => {

        if (translation !== '' && source === '') {
            getTranslation(translation, {from: 'uk', to: 'en'}).then(res => {
                setSource(res)
                if (transcription === '') {
                    getTranscription(res).then(res => {
                        setChange(true)
                        setTranscription(res)
                    })
                }
            })
        }
        if (source !== '' && translation === '') {
            getTranslation(source, {from: 'en', to: 'uk'}).then(res => {
                setTranslation(res)
                if (transcription === '') {
                    getTranscription(source).then(res => {
                        setChange(true)
                        setTranscription(res)
                    })
                }
            })
        }
    }, [])

    const inSearchProcess = () => {
        return source === processStr || transcription === processStr || translation === processStr
    }

    React.useEffect(() => {
        if (onChange && change && !inSearchProcess()) {
            setChange(false)
            onChange({source, transcription, translation})
        }
    }, [source, transcription, translation, change])

    return (
        <div>
            <div>
                <BaseInput
                    label="Source"
                    value={source}
                    onChange={e => {
                        setChange(true)
                        setSource(e.target.value)
                    }}
                />
                <button onClick={sourceSearchHandler}>Search</button>
                (EN)
            </div>
            <div>
                <BaseInput
                    label="Transcription"
                    value={transcription}
                    onChange={e => {
                        setChange(true)
                        setTranscription(e.target.value)
                    }}
                />
                (For Source)
            </div>
            <div>
                <BaseInput
                    label="Translation"
                    value={translation}
                    onChange={e => {
                        setChange(true)
                        setTranslation(e.target.value)
                    }}
                />
                <button onClick={translationSearchHandler}>Search</button>
                (UK)
            </div>
        </div>
    )
}

export default TranslationInputs
