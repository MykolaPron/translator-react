import {DBTable} from "./DBTableClass";
import {EStorageTable} from "../../shared/enums/EStorageTable";
import {StorageRecordModel} from "../../shared/models/StorageRecordModel";
import {TestModel} from "../../shared/models/TestModel";

export type TTestTable = StorageRecordModel & TestModel
export const testTable = new DBTable<TTestTable>(EStorageTable.Test,  ["status", "groupIds"])
