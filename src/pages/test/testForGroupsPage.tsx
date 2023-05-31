import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Navigate, useLocation, useParams} from "react-router-dom";
import {ERoute} from "../../shared/enums/ERoute";
import {groupTable, TGroupTable} from "../../services/StorageService/groupTable";
import {translationToGroupTable, TTranslationToGroupTable} from "../../services/StorageService/translationToGroupTable";
import {translationTable, TTranslationTable} from "../../services/StorageService/translationTable";
import s from "./test.module.css"
import {testTable} from "../../services/StorageService/testTable";
import {isArray} from "util";
import {translationToTestTable} from "../../services/StorageService/translationToTestTable";
import {TestModel, TranslationToTestModel} from "../../shared/models/TestModel";
import {TranslationToGroupModel} from "../../shared/models/GroupModel";
import {useNavigate} from "react-router";

type TQuestionData = {
    id: number
    correct: number,
    wrong: number
    translation: TTranslationTable,
}

const TestForGroupsPage = () => {
    const navigate = useNavigate();

    const {state: {testId}} = useLocation();
    const test = useMemo(() => testTable.getById(testId), [testId])
    const groups = useMemo(() => groupTable.getAll({
        query: (row: TGroupTable) => {
            return test.groupIds.includes(row.ID)
        }
    }), [testId])

    const [status, setStatus] = useState(false)
    const [questions, setQuestions] = useState<TQuestionData[]>(() => {
        const questions = translationToTestTable.getAll({query: {testId: test.ID}})
        return questions.map(e => ({
            id: e.ID,
            correct: e.correct,
            wrong: e.wrong,
            translation: translationTable.getById(e.translationId)
        }))
    })
    const [questionIndex, setQuestionIndex] = useState<number>(0)

    const setQuestionAnswerHandler = (answer: boolean) => () => {
        const key = answer ? 'correct' : 'wrong'

        setQuestions(prevState => {
            return prevState.map((answer, index) => {
                if (index !== questionIndex) {
                    return answer
                } else {
                    const data = {[key]: answer[key] + 1}

                    translationToTestTable.updateById<typeof data>(answer.id, data)
                    return {...answer, ...data}
                }
            })
        })
    }

    const getNotRepeated = (arr: any[]) => {
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

        if (hasMistakes.length) return getNotRepeated(hasMistakes)

        setStatus(true)

        return getNotRepeated(questions.map((e, i) => i))
    }
    useEffect(() => {
        const index = getRandomQuestionIndex()
        setQuestionIndex(index)
    }, [questions])

    const endTestHandler = () => {
        testTable.updateById(testId, {status: "end"})
        navigate('/' + ERoute.Test);
    }

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
                    {status && <div>
                        <div style={{color: 'green'}}>Complete!</div>
                        <button onClick={endTestHandler}>Finish test</button>
                    </div>}
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
