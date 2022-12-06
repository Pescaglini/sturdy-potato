


// 0 = UnderPlayer, 1 = AsPlayer, 2 = AbovePlayer, 3 = Filters, 4 = mask
export enum worldLayersEnum {
    UnderPlayer = 0,
    Enemies = 1,
    AsPlayer = 2,
    AbovePlayer = 3,
    Filters = 4,
    Mask = 5,
}

export enum eventTypesEnum {
    EnemyCreation = "EnemyCreation",
    EnemyDeleted = "EnemyDeleted",
    EnemyDead = "EnemyDead",
    DayStarts = "DayStarts",
    NightStarts = "NightStarts",
}