import {translationTable} from "./translationTable";
import {groupTable} from "./groupTable";
import {translationToGroupTable} from "./translationToGroupTable";
import {lib} from "../../index";

export const getDatabaseData = () => {
    return lib.serialize();
}
export const setDatabaseData = (json: any) => {
    return lib.replace(json);
}

export const storageInit = () => {
    translationTable.create()
    groupTable.create()
    translationToGroupTable.create()
}
