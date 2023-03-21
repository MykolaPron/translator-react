import {StorageRecordModel} from "../../shared/models/StorageRecordModel";
import {DBTable} from "./DBTableClass";
import {EStorageTable} from "../../shared/enums/EStorageTable";

export type TTranslationToGroupTable = StorageRecordModel & {groupId: number, translationId: number}
export const translationToGroupTable = new DBTable<TTranslationToGroupTable>(EStorageTable.TranslationToGroup,  ["groupId", "translationId"])
