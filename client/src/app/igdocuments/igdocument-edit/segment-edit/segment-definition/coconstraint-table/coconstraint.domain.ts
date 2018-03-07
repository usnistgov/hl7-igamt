/**
 * Created by hnt5 on 9/30/17.
 */
export interface CoConstraintTable {
    grp : boolean,
    dyn : boolean,
    headers : CCHeaders,
    content : CCContent
}

export interface CCHeaders {
    selectors : CCHeader[],
    data : CCHeader[],
    user : CCHeader[]
}

export interface CCContent {
    free? : CCRow[],
    groups? : CCGroup[]
}

export interface CCHeader {
    id : string,
    label : string,
    keep? : boolean,
    content? : DataElementHeader,
}

export interface CCRequirement {
    usage : string;
    cardinality : {
        min : number;
        max : string;
    }
}

export interface CCGroup {
    data : CCGroupData;
    content : CCContent;
}

export interface CCGroupData {
    name : string;
    requirements : CCRequirement;
}

export interface CCRow {
    [ header : string ] : CCCell,
    requirements : CCRequirement;
}

export interface CCCell {

}

export interface DataCell extends CCCell {
    value : string;
}

export interface VSCell extends CCCell {
    [index : number] : CCVSValue;
}

export interface DataElementHeader {
    path : string,
    elmType : string,
    type : CCSelectorType
}

export enum CCSelectorType {
    ByValue = 1,
    ByValueSet = 2,
    DataType = 3,
    DatatypeFlavor = 4,
    ByCode = 5
}

export interface CCVSValue {
    bindingIdentifier : string;
    bindingStrength : string;
    bindingLocation : string;
    hl7Version : string;
    name : string;
    scope : string;
}
