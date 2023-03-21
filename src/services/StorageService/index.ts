import {translationTable} from "./translationTable";
import {groupTable} from "./groupTable";
import {translationToGroupTable} from "./translationToGroupTable";


export const storageInit = () => {
    translationTable.create()
    groupTable.create()
    translationToGroupTable.create()
}
