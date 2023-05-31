export interface TestModel {
    status: 'start' | 'end'
    groupIds: number[]
}
export interface TranslationToTestModel {
    testId: number,
    translationId: number,

    correct: number,
    wrong: number,
}
