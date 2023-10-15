import { Context } from "telegraf"

export interface SessionData {
    youtubeLink: string
}

export interface MyContext extends Context {
    session?: SessionData
}

export enum Language {
    persian = 'persian',
    english = 'english'
}