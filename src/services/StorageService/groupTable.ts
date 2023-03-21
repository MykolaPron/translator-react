import {StorageRecordModel} from "../../shared/models/StorageRecordModel";
import {GroupModel} from "../../shared/models/GroupModel";
import {DBTable} from "./DBTableClass";
import {EStorageTable} from "../../shared/enums/EStorageTable";
import {translationToGroupTable} from "./translationToGroupTable";

export type TGroupTable = StorageRecordModel & GroupModel
export const groupTable = new DBTable<TGroupTable>(EStorageTable.Group,  ["name"])

groupTable.beforeDelete = function (){
    const children = translationToGroupTable.getAll({query:{groupId: this.id}})
    children.forEach(e => {
        translationToGroupTable.deleteById(e.ID)
    })
}
