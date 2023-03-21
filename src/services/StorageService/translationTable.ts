import {StorageRecordModel} from "../../shared/models/StorageRecordModel";
import {TranslationModel} from "../../shared/models/TranslationModel";
import {DBTable} from "./DBTableClass";
import {EStorageTable} from "../../shared/enums/EStorageTable";
import {translationToGroupTable} from "./translationToGroupTable";

export type TTranslationTable = StorageRecordModel & TranslationModel
export const translationTable = new DBTable<TTranslationTable>(EStorageTable.Translation,  ["source", "transcription", "translation"])

translationTable.beforeDelete = function (){
    const children = translationToGroupTable.getAll({query:{translationId: this.id}})
    children.forEach(e => {
        translationToGroupTable.deleteById(e.ID)
    })
}
