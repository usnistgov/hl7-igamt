import { IDisplayElement } from "../../shared/models/display-element.interface";

export interface IgExampleMessages {
    id: string;
    title: string;
    profileExampleMessages: IProfileExampleMessages[];
}

export interface IProfileExampleMessages {
    profile: IDisplayElement;
    exampleMessages: IExampleMessage[];
}

export interface IExampleMessage {
    id: string;
    name: string;
    message: string;
    narrativeHTML: string;
    profileId: string;
    snippets: IExampleMessageSnippet[];
}

export interface IExampleMessageSnippet {
    id: string;
    name: string;
    messageReferences: string[];
    narrativeHTML: string;
}

export interface IExampleMessageDTO {
    id: string;
    name: string;
    message: string;
    narrativeHTML: string;
    profile: IDisplayElement;
}

export interface MessageElement {
    name: string;
    positionalPath: string;
    profilePath: string;
    hl7Path: string;
    start: {
        line: number;
        column: number;
    };
    end: {
        line: number;
        column: number;
    };
}