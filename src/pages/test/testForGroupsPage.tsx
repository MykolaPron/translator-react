import React, {useEffect, useMemo, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import {ERoute} from "../../shared/enums/ERoute";
import {groupTable, TGroupTable} from "../../services/StorageService/groupTable";
import {translationToGroupTable, TTranslationToGroupTable} from "../../services/StorageService/translationToGroupTable";
import {translationTable, TTranslationTable} from "../../services/StorageService/translationTable";
import s from "./test.module.css"

type TQuestionData = {
    correct: number,
    wrong: number
    translation: TTranslationTable,
}

const TestForGroupsPage = () => {
    const {groupIds} = useParams();

    const [status, setStatus] = useState(false)
    const [questions, setQuestions] = useState<TQuestionData[]>([])
    const [questionIndex, setQuestionIndex] = useState<number>(0)

    if (!groupIds) {
        alert('Not Correct groups data...')
        return <Navigate to={ERoute.Main + ERoute.Test} replace={true}/>
    }
    const groupIdsArr = useMemo(() => groupIds.split(',').map(e => +e), [groupIds])

    if (groupIdsArr.some(e => isNaN(e))) {
        alert('Not Correct groups data...')
        return <Navigate to={ERoute.Main + ERoute.Test} replace={true}/>
    }

    const groups = useMemo(() => groupTable.getAll({
            query: (row: TGroupTable) => {
                return groupIdsArr.includes(row.ID)
            }
        })
        , [groupIds])

    useEffect(() => {
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

        const answers = translations.map((e) => {
            return {
                translation: e,
                correct: 0,
                wrong: 0
            }
        })

        setQuestions(answers)
    }, [])

    const setQuestionAnswerHandler = (answer: boolean) => () => {
        const key = answer ? 'correct' : 'wrong'

        setQuestions(prevState => {
            return prevState.map((answer, index) => {
                return index !== questionIndex
                    ? answer
                    : {...answer, [key]: answer[key] + 1}
            })
        })
    }

    const getNotRepeaterd = (arr: any[]) => {
        const r = Math.floor(Math.random() * arr.length)
        if (arr.length > 1 && arr[r] === questionIndex && arr.length > 1) {
            return getRandomQuestionIndex()
        } else {
            return arr[r]
        }
    }

    const getRandomQuestionIndex = (): number => {
        if (!questions.length) return 0

        const notUsed = questions.reduce<number[]>((a, e, i) => (!e.correct && !e.wrong ? [...a, i] : [...a]), [])
        if (notUsed.length) {
            const r = Math.floor(Math.random() * notUsed.length)
            return notUsed[r]
        }
        const hasMistakes = questions.reduce<number[]>((a, e, i) => (e.correct < e.wrong ? [...a, i] : [...a]), [])

        if (hasMistakes.length) return getNotRepeaterd(hasMistakes)

        setStatus(true)

        return getNotRepeaterd(questions.map((e, i) => i))
    }
    useEffect(() => {
        setQuestionIndex(getRandomQuestionIndex())
    }, [questions])

    const answersCount = {
        correct: questions.reduce((a, e) => a + e.correct, 0),
        wrong: questions.reduce((a, e) => a + e.wrong, 0),
        get total() {
            return this.correct + this.wrong
        }
    }

    return (
        <div className={s.container}>
            <div>
                <h2>Test For Group Page</h2>
                <div>
                    Test for words in groups: {groups.map(e => e.name).join(', ')}.
                </div>
                <div>
                    {status && <div style={{color: 'green'}}>Complete!</div>}
                    Answers Count : {answersCount.total}
                    {answersCount.total ? `(${answersCount.correct}/${answersCount.wrong})` : ''}
                </div>
                <br/>
                {
                    questions.length ? <div>
                        <div>
                            <div>{questions[questionIndex].translation.source}</div>
                            <div>{questions[questionIndex].translation.transcription}</div>
                            <div>{questions[questionIndex].translation.translation}</div>
                        </div>
                        <div>
                            <button onClick={setQuestionAnswerHandler(true)}>Good</button>
                            <button onClick={setQuestionAnswerHandler(false)}>Bad</button>
                        </div>
                    </div> : ''
                }
            </div>
            <div>
                <ul>
                    {questions.map(({translation, correct, wrong}, index) => <li key={translation.ID}>
                        <span style={{
                            marginRight: '1rem',
                            color: questionIndex === index ? 'red' : ''
                        }}>
                           ({correct}/{wrong})
                        </span>
                        <span>
                            {translation.source} -
                            [{translation.transcription}] - {translation.translation}
                        </span>
                    </li>)}
                </ul>
            </div>
        </div>
    )
}

export default TestForGroupsPage
