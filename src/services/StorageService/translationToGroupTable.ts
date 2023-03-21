import {StorageRecordModel} from "../../shared/models/StorageRecordModel";
import {DBTable} from "./DBTableClass";
import {EStorageTable} from "../../shared/enums/EStorageTable";
import {TranslationToGroupModel} from "../../shared/models/GroupModel";

export type TTranslationToGroupTable = StorageRecordModel & TranslationToGroupModel
export const translationToGroupTable = new DBTable<TTranslationToGroupTable>(EStorageTable.TranslationToGroup,  ["groupId", "translationId"])
