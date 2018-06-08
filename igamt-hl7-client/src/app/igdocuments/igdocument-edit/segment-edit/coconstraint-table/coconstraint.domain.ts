/**
 * Created by hnt5 on 9/30/17.
 */
export interface CoConstraintTable {
    id?: string;
    supportGroups: boolean;
    segment: string;
    headers: CCHeaders;
    content: CCContent;
}

export interface CCHeaders {
    selectors: CCHeader[];
    data: CCHeader[];
    user: CCHeader[];
}

export interface CCContent {
    free?: CCRow[];
    groups?: CCGroup[];
}

export interface CCHeader {
    id: string;
    label: string;
    keep?: boolean;
    template?: string;
    content?: DataElementHeader;
}

export interface CCRequirement {
    usage: string;
    cardinality: {
        min: number;
        max: string;
    };
}

export interface CCGroup {
    data: CCGroupData;
    content: CCContent;
}

export interface CCGroupData {
    name: string;
    requirements: CCRequirement;
}

export interface CCRow {
    id: string;
    cells: {
        [ header: string ]: CCCell
    };
    requirements: CCRequirement;
}

export interface CCCell {
    type: string;
}

export interface DataCell extends CCCell {
    value: string;
}

export interface CodeCell extends DataCell {
    value: string;
    location: string;
}


export interface VSCell extends CCCell {
    vs: CCVSValue[];
}

export interface VariesCell extends CCCell {
    value: CCCell;
}


export interface DataElementHeader {
    path: string;
    elmType: string;
    type: string;
}

export class CCSelectorType {
    public static VALUE = 'Value';
    public static VALUESET = 'ValueSet';
    public static CODE = 'Code';
    public static IGNORE = 'Ignore';
}

export class CellTemplate {
    public static DATATYPE = 'Datatype';
    public static FLAVOR = 'Flavor';
    public static TEXTAREA = 'textArea';
    public static VARIES = 'Varies';
}

export interface CCVSValue {
    bindingIdentifier: string;
    bindingStrength: string;
    bindingLocation: string;
    hl7Version: string;
    name: string;
    scope: string;
}

