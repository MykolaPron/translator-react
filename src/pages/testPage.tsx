import React, {useState} from "react";
import GroupSelect from "../components/GroupSelect";
import {TGroupTable} from "../services/StorageService/groupTable";
import {useNavigate} from "react-router";
import {ERoute} from "../shared/enums/ERoute";

const TestPage = () => {
    const navigate = useNavigate();
    const [canStart, setCanStart] = useState(false)
    const [selected, setSelected] = useState<TGroupTable[]>([])

    const changeSelectHandler = (groups: TGroupTable[]) => {
        setSelected(groups)
        setCanStart(groups.length > 0)
    }
    const startTestHandler = () => {
        const groupIds = selected.map(e => e.ID).join(',')
        navigate(ERoute.TestForGroups + '/' + groupIds);
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
