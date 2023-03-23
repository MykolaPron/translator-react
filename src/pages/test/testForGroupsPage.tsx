import React, {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import {ERoute} from "../../shared/enums/ERoute";
import {groupTable, TGroupTable} from "../../services/StorageService/groupTable";
import {translationToGroupTable, TTranslationToGroupTable} from "../../services/StorageService/translationToGroupTable";
import {translationTable, TTranslationTable} from "../../services/StorageService/translationTable";

type TAnswerData = {
    translation: TTranslationTable,
    correct: number,
    wrong: number
}

const TestForGroupsPage = () => {
    const {groupIds} = useParams();

    const [groups, setGroups] = useState<TGroupTable[]>([])
    const [translations, setTranslations] = useState<TTranslationTable[]>([])
    const [answers, setAnswers] = useState<TAnswerData[]>([])
    const [testQuestion, setTestQuestion] = useState<TTranslationTable | null>(null)

    if (!groupIds) {
        alert('Not Correct groups data...')
        return <Navigate to={ERoute.Main + ERoute.Test} replace={true}/>
    }
    const groupIdsArr = groupIds.split(',').map(e => +e)
    if (groupIdsArr.some(e => isNaN(e))) {
        alert('Not Correct groups data...')

        return <Navigate to={ERoute.Main + ERoute.Test} replace={true}/>
    }

    useEffect(() => {
        const groups = groupTable.getAll({
            query: (row: TGroupTable) => {
                return groupIdsArr.includes(row.ID)
            }
        })
        setGroups(groups)

        const translationToGroup = translationToGroupTable.getAll({
            query: (row: TTranslationToGroupTable) => {
                return groupIdsArr.includes(row.groupId)
            }
        })
        const translationsIds = translationToGroup.map(e => e.translationId)

        const translations = translationTable.getAll({
            query: (row: TTranslationTable) => {
                return translationsIds.includes(row.ID)
            }
        })
        setTranslations(translations)

        const answers = translations.map((e) => {
            return {
                translation: e,
                correct: 0,
                wrong: 0
            }
        })

        setAnswers(answers)
    }, [groupIds])

    useEffect(()=>{
        setTestQuestion(() => {
            return getRandomTranslation()
        })
    },[translations])

    function getRandomTranslation(): TTranslationTable {
        const rand = translations[Math.floor(Math.random() * translations.length)];

        if(testQuestion && rand.ID === testQuestion.ID){
            return getRandomTranslation()
        }else{
            return rand
        }
    }

    const setQuestionAnswerHandler = (answer: boolean) =>()=>{
        if(!testQuestion) return;

        const key = answer ? 'correct' : 'wrong'
        setAnswers(prevState => {
            return prevState.map(answer => {
                return answer.translation.ID !== testQuestion.ID
                    ? answer
                    : {...answer, [key]:answer[key] + 1}
            })
        })
        setTestQuestion(() => {
            return getRandomTranslation()
        })
    }

    return (
        <div>
            <h2>Test For Group Page</h2>
            <div>
                Test for words in groups: {groups.map(e => e.name).join(', ')}.
            </div>
            {!testQuestion ? '' : <div>
                <div>{testQuestion.source} - [{testQuestion.transcription}] - {testQuestion.translation}</div>
                <div>
                    <button onClick={setQuestionAnswerHandler(true)}>Good</button>
                    <button onClick={setQuestionAnswerHandler(false)}>Bad</button>
                </div>
            </div>}
            <div>
                <ul>
                    {answers.map(({translation, correct, wrong})=> <li key={translation.ID}>
                        <div>
                            Total(Good/Bad): {correct + wrong} ({correct}/{wrong})
                        </div>
                        <div>{translation.source} - [{translation.transcription}] - {translation.translation}</div>
                    </li>)}
                </ul>
            </div>

        </div>
    )
}


export default TestForGroupsPage
