import { Injectable } from '@angular/core';
import {DatatypesService} from "../../igdocument-edit/datatype-edit/datatypes.service";
import {GeneralConfigurationService} from "../../../service/general-configuration/general-configuration.service";
import { _ }  from 'underscore';

@Injectable()
export class ConstraintsService {

    constructor(private datatypesService : DatatypesService, private configService : GeneralConfigurationService) {}

    generateTreeData(assertion, treeData, idMap, datatypesLinks){
        if(assertion
            && assertion.subject
            && assertion.subject.path
            && assertion.subject.path.child) this.popTreeData(assertion.subject.path.child, treeData, idMap, datatypesLinks);

        if(assertion
            && assertion.complement
            && assertion.complement.path
            && assertion.complement.path.child) this.popTreeData(assertion.complement.path.child, treeData, idMap, datatypesLinks);

        if(assertion && assertion.ifAssertion) this.generateTreeData(assertion.ifAssertion, treeData, idMap, datatypesLinks);

        if(assertion && assertion.thenAssertion) this.generateTreeData(assertion.thenAssertion, treeData, idMap, datatypesLinks);

        if(assertion && assertion.child) this.generateTreeData(assertion.child, treeData, idMap, datatypesLinks);

        if(assertion && assertion.assertions) {
            for (let a of assertion.assertions) {
                this.generateTreeData(a, treeData, idMap, datatypesLinks);
            }
        }

    }

    popTreeData(currentPath, currentTreeNode, idMap, datatypesLinks){
        if(currentPath.elementId){
            var node = _.find(currentTreeNode, function(child){ return child.data.id === currentPath.elementId; });
            if(!node.leaf){
                this.loadNode(currentPath, node, idMap, datatypesLinks);
            }
        }
    }

    loadNode(currentPath, node, idMap, datatypesLinks) {
        if(node && !node.children) {
            this.datatypesService.getDatatypeStructure(node.data.dtId).then(dtStructure  => {
                dtStructure.children = _.sortBy(dtStructure.children, function(child){ return child.data.position});
                idMap[node.data.idPath].dtName = dtStructure.name;
                if(dtStructure.children){
                    for (let child of dtStructure.children) {
                        var childData =  JSON.parse(JSON.stringify(node.data.pathData));

                        this.makeChild(childData, child.data.id, '1');

                        var data = {
                            id: child.data.id,
                            name: child.data.name,
                            max: "1",
                            position: child.data.position,
                            usage: child.data.usage,
                            dtId: child.data.ref.id,
                            idPath: node.data.idPath + '-' + child.data.id,
                            pathData: childData
                        };

                        var treeNode = {
                            label: child.data.position + '. ' + child.data.name,
                            data:data,
                            expandedIcon: "fa-folder-open",
                            collapsedIcon: "fa-folder",
                            leaf:false
                        };

                        var dt = this.getDatatypeLink(child.data.ref.id, datatypesLinks);

                        if(dt.leaf) treeNode.leaf = true;
                        else treeNode.leaf = false;

                        idMap[data.idPath] = data;
                        if(!node.children) node.children = [];
                        node.children.push(treeNode);

                    }
                }

                if(currentPath.child) this.popTreeData(currentPath.child, node.children, idMap, datatypesLinks);
            });
        }
    }


    makeChild(data, id, para){
        if(data.child) this.makeChild(data.child, id, para);
        else data.child = {
            elementId: id,
            instanceParameter: para
        }
    }

    getDatatypeLink(id, datatypesLinks){
        for (let dt of datatypesLinks) {
            if(dt.id === id) return JSON.parse(JSON.stringify(dt));
        }
        console.log("Missing DT:::" + id);
        return null;
    }

    private getLocationLabel(location, structure){
        if(location.path){
            let result:string = structure.name;
            result = this.getChildLocation(location.path.child, structure.structure, result, null);
            return result;
        }
        return null;
    }

    private getChildLocation(path, list, result, elementName){
        if(path && list){
            for(let item of list){
                if(item.data.id === path.elementId) {
                    if(item.data.type === 'FIELD'){
                        result = result + '-' + item.data.position;
                    }else if(item.data.type === 'COMPONENT' || item.data.type === 'SUBCOMPONENT'){
                        result = result + '.' + item.data.position;
                    }else {
                        result = result + '.' + item.data.name;
                    }
                    elementName = item.data.name;

                    return this.getChildLocation(path.child,item.children, result, elementName);
                }
            }
        }
        return result + "(" + elementName + ")";
    }

    generateDescriptionForSimpleAssertion(assertion, structure){
        console.log(assertion);
        if(assertion.mode === 'SIMPLE'){

            let subject,verb,complementKey:string;

            if(assertion.subject && assertion.subject.path){
                subject = this.getLocationLabel(assertion.subject,structure);
                if(assertion.subject.occurenceType){
                    if(assertion.subject.occurenceType === 'atLeast'){
                        subject = "At least one occurrence of " + subject;
                    }else if(assertion.subject.occurenceType === 'instance'){
                        subject = "The " + assertion.subject.occurenceValue  + " occurrence of " + subject;
                    }else if(assertion.subject.occurenceType === 'noOccurrence'){
                        subject = "No occurrence of " + subject;
                    }else if(assertion.subject.occurenceType === 'exactlyOne'){
                        subject = "Exactly one occurrence of " + subject;
                    }else if(assertion.subject.occurenceType === 'count'){
                        subject = assertion.subject.occurenceValue  + " occurrences of " + subject;
                    }else if(assertion.subject.occurenceType === 'all'){
                        subject = "All occurrences of " + subject;
                    }
                }
            }

            if(assertion.verbKey){
                verb = assertion.verbKey;
            }

            if(assertion.complement) {
                complementKey = assertion.complement.complementKey;
            }

            console.log(subject);
            console.log(verb);
            console.log(complementKey);

            if(subject && verb && complementKey){
                if(complementKey === 'containtValue'){
                    let value:string;
                    value = assertion.complement.value;

                    if(value){
                        assertion.description = subject + ' ' + verb + ' contain the constant value \'' + value + '\'';
                    }
                }if(complementKey === 'valued'){
                    assertion.description = subject + ' ' + verb + ' valued';
                }else if(complementKey === 'containValueDesc'){
                    let value,description:string;
                    value = assertion.complement.value;
                    description = assertion.complement.desc;

                    if(value){
                        assertion.description = subject + ' ' + verb + ' contain the constant value \'' + value + '\' (' + description + ')';
                    }
                }else if(complementKey === 'containCode'){
                    let value,codesys:string;
                    value = assertion.complement.value;
                    codesys = assertion.complement.codesys;

                    if(value){
                        assertion.description = subject + ' ' + verb + ' contain the constant value \'' + value + '\' ' + 'drawn from the code system \'' + codesys + '\'.';
                    }
                }else if(complementKey === 'containListValues'){
                    let values:string[];
                    values = assertion.complement.values;

                    if(values){
                        assertion.description = subject + ' ' + verb + ' contain one of the values in the list: {' + values + '}.';
                    }
                }else if(complementKey === 'containListCodes'){
                    let values:string[];
                    let codesys:string;
                    values = assertion.complement.values;
                    codesys = assertion.complement.codesys;

                    if(values){
                        assertion.description = subject + ' ' + verb + ' contain one of the values in the list: {' + values + '} drawn from the code system \'' + codesys + '\'.';
                    }
                }else if(complementKey === 'regex'){
                    let value:string;
                    value = assertion.complement.value;

                    if(value){
                        assertion.description = subject + ' ' + verb + ' match the regular expression \'' + value + '\'';
                    }
                }else if(complementKey === 'positiveInteger'){
                    assertion.description = subject + ' ' + verb + ' contain a positive integer.';
                }else if(complementKey === 'sequentially'){
                    assertion.description = subject + ' ' + verb + " be valued sequentially starting with the value '1'.";
                }else if(complementKey === 'iso'){
                    assertion.description = subject + ' ' + verb + " be valued with an ISO-compliant OID.";
                }else {
                    let compareNode:string;
                    if(assertion.complement.path){
                        compareNode = this.getLocationLabel(assertion.complement,structure);
                        if(assertion.complement.occurenceType){
                            if(assertion.subject.occurenceType === 'atLeast'){
                                compareNode = "At least one occurrence of " + compareNode;
                            }else if(assertion.subject.occurenceType === 'instance'){
                                compareNode = "The " + assertion.subject.occurenceValue  + " occurrence of " + compareNode;
                            }else if(assertion.subject.occurenceType === 'noOccurrence'){
                                compareNode = "No occurrence of " + compareNode;
                            }else if(assertion.subject.occurenceType === 'exactlyOne'){
                                compareNode = "Exactly one occurrence of " + compareNode;
                            }else if(assertion.subject.occurenceType === 'count'){
                                compareNode = assertion.subject.occurenceValue  + " occurrences of " + compareNode;
                            }else if(assertion.subject.occurenceType === 'all'){
                                compareNode = "All occurrences of " + compareNode;
                            }
                        }

                        console.log(compareNode);

                        if(complementKey === 'c-identical'){
                            assertion.description = subject + ' ' + verb + ' be identical to ' + compareNode + ".";
                        }else if(complementKey === 'c-earlier'){
                            assertion.description = subject + ' ' + verb + ' be earlier than ' + compareNode + ".";
                        }else if(complementKey === 'c-earlier-equivalent'){
                            assertion.description = subject + ' ' + verb + ' be earlier than or equivalent to ' + compareNode + ".";
                        }else if(complementKey === 'c-truncated-earlier'){
                            assertion.description = subject + ' ' + verb + ' be truncated earlier than ' + compareNode + ".";
                        }else if(complementKey === 'c-truncated-earlier-equivalent'){
                            assertion.description = subject + ' ' + verb + ' be truncated earlier than or truncated equivalent to ' + compareNode + ".";
                        }else if(complementKey === 'c-equivalent'){
                            assertion.description = subject + ' ' + verb + ' be equivalent to ' + compareNode + ".";
                        }else if(complementKey === 'c-truncated-equivalent'){
                            assertion.description = subject + ' ' + verb + ' be truncated equivalent to ' + compareNode + ".";
                        }else if(complementKey === 'c-equivalent-later'){
                            assertion.description = subject + ' ' + verb + ' be equivalent to or later than ' + compareNode + ".";
                        }else if(complementKey === 'c-later'){
                            assertion.description = subject + ' ' + verb + ' be later than ' + compareNode + ".";
                        }else if(complementKey === 'c-truncated-equivalent-later'){
                            assertion.description = subject + ' ' + verb + ' be truncated equivalent to or truncated later than ' + compareNode + ".";
                        }else if(complementKey === 'c-truncated-later'){
                            assertion.description = subject + ' ' + verb + ' be truncated later than ' + compareNode + ".";
                        }

                    }


                }
            }
        }
        else if(assertion.mode === 'ANDOR'){
            let operator, result:string;
            let assertions:any[];
            let isReady:boolean = true;

            operator = assertion.operator;
            assertions = assertion.assertions;

            if(operator && assertions && assertions.length > 1){
                for (let childAssertion of assertions) {
                    this.generateDescriptionForSimpleAssertion(childAssertion,structure);
                    if(!childAssertion.description) isReady = false;

                    if(result){
                        result = result + ' ' + operator + ' {' + childAssertion.description + '}';
                    }else {
                        result = '{' + childAssertion.description + '}';
                    }
                }
            }
            if(result) result = result;
            if(isReady && result){
                assertion.description = result;
            }
        }else if(assertion.mode === 'NOT'){
            let result:string;
            let child:any;
            let isReady:boolean = true;

            child = assertion.child;

            if(assertion){
                this.generateDescriptionForSimpleAssertion(child,structure);
                if(!child.description) isReady = false;

                result = 'NOT{' + child.description + '}';
            }
            if(isReady && result){
                assertion.description = result;
            }
        }else if(assertion.mode === 'IFTHEN'){
            let result:string;
            let ifAssertion,thenAssertion:any;
            let isReady:boolean = true;

            ifAssertion = assertion.ifAssertion;
            thenAssertion = assertion.thenAssertion;

            if(ifAssertion && thenAssertion){
                this.generateDescriptionForSimpleAssertion(ifAssertion,structure);
                this.generateDescriptionForSimpleAssertion(thenAssertion,structure);

                if(!ifAssertion.description) isReady = false;
                if(!thenAssertion.description) isReady = false;

                result = 'IF [' + ifAssertion.description + '], then [' + thenAssertion.description + ']';
            }
            if(isReady && result){
                assertion.description = result;
            }
        }
    }
}