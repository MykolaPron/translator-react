import {StorageRecordModel} from "../../shared/models/StorageRecordModel";
import {DBTable} from "./DBTableClass";
import {EStorageTable} from "../../shared/enums/EStorageTable";
import {TranslationToTestModel} from "../../shared/models/TestModel";

export type TTranslationToTestTable = StorageRecordModel & TranslationToTestModel
export const translationToTestTable = new DBTable<TTranslationToTestTable>(EStorageTable.TranslationToTest,
    ["testId", "translationId", "correct", "wrong"]
)
