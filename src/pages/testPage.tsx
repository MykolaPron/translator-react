import React, {useEffect, useState} from "react";
import GroupSelect from "../components/GroupSelect";
import {TGroupTable} from "../services/StorageService/groupTable";
import {useNavigate} from "react-router";
import {ERoute} from "../shared/enums/ERoute";
import {testTable} from "../services/StorageService/testTable";
import {TestModel, TranslationToTestModel} from "../shared/models/TestModel";
import {translationToGroupTable, TTranslationToGroupTable} from "../services/StorageService/translationToGroupTable";
import {translationTable, TTranslationTable} from "../services/StorageService/translationTable";
import {translationToTestTable} from "../services/StorageService/translationToTestTable";

const TestPage = () => {
    const navigate = useNavigate();
    const [canStart, setCanStart] = useState(false)
    const [selected, setSelected] = useState<TGroupTable[]>([])

    const startTest = () => {
        const groupIds = selected.map(e => e.ID)
        const testId = testTable.add<TestModel>({status: "start", groupIds})

        const translationToGroup = translationToGroupTable.getAll({
            query: (row: TTranslationToGroupTable) => groupIds.includes(row.groupId)
        })

        const translationsIds = translationToGroup.map(e => e.translationId)

        const translations = translationTable.getAll({
            query: (row: TTranslationTable) => translationsIds.includes(row.ID)
        })

        const questionIds = translations.map(translation =>{
            return translationToTestTable.add<TranslationToTestModel>({
                testId,
                translationId:translation.ID,
                correct:0,
                wrong:0
            })
        })
        return{
            testId,
            questionIds
        }
    }

    const endTest = (testId: number) =>{
        testTable.updateById(testId, {status: "end"})
    }
    useEffect(() => {
        const openTests = testTable.getAll({query: {status: 'start'}})

        if (openTests.length) {
            const isConfirmed = confirm('Exist all ready started Test!!\n Press:\n"Ok": To continue the test.\n"Cancel": Tо End that test and start new.')

            const testId = openTests[0].ID

            if (isConfirmed) {
                navigate(ERoute.TestForGroups, {
                    state: {testId: testId}
                });
            } else {
                endTest(testId)
            }
        }

    }, [])

    const changeSelectHandler = (groups: TGroupTable[]) => {
        setSelected(groups)
        setCanStart(groups.length > 0)
    }

    const startTestHandler = () => {
        const {testId} = startTest()
        navigate(ERoute.TestForGroups, {state: {testId}});
    }

    return (
        <div>
            <h2>Test Page</h2>
            <GroupSelect onChange={changeSelectHandler}/>
            <div>{selected.map(e => e.name).join(', ')}</div>
            <button onClick={startTestHandler} disabled={!canStart}>Start test</button>
        </div>
    )
}

export default TestPage
