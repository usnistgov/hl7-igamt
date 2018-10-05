import { Injectable } from '@angular/core';
import {DatatypesService} from "../../igdocuments/igdocument-edit/datatype-edit/datatypes.service";
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";
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

    generateDescriptionForSimpleAssertion(assertion, idMap){
        if(assertion.mode === 'SIMPLE'){

            let subject,verb,complementKey:string;

            if(assertion.subject && assertion.subject.path){
                subject = this.parsePath(assertion.subject.path, idMap, null, null, '-', null);
                subject = subject + this.getInstanceNumForPath(assertion.subject.path, idMap);
            }

            if(assertion.verbKey){
                verb = assertion.verbKey;
            }

            if(assertion.complement) {
                complementKey = assertion.complement.complementKey;
            }

            if(subject && verb && complementKey){
                if(complementKey === 'SAMEVALUE'){
                    let casesensitive:boolean;
                    let value:string;

                    casesensitive = assertion.complement.casesensitive;
                    value = assertion.complement.value;

                    if(value){
                        assertion.description = 'The content of ' + subject + ' ' + verb + ' contain the constant value \'' + value + '\'' + ((casesensitive) ? '(case-sensitive).' : '(case-insensitive)');
                    }
                }else if(complementKey === 'LISTVALUE'){
                    let values:string[];
                    values = assertion.complement.values;

                    if(values && values.length > 0){
                        assertion.description = 'The content of ' + subject + ' ' + verb + ' contain one of the values ' + this.parseValues(values, null, 0, null);
                    }
                }else if(complementKey === 'PRESENCE'){
                    assertion.description = subject + ' ' + verb + ' presence';
                }else if(complementKey === 'COMPARENODE'){
                    //The content of LOCATION 1 (DESCRIPTION) SHALL be identical to the content of LOCATION 2 (DESCRIPTION).
                    let operator, otherLocation:string;
                    let path:any;

                    operator = assertion.complement.operator;
                    path = assertion.complement.path;

                    if(path) {
                        otherLocation = this.parsePath(path, idMap, null, null, '-', null);
                        otherLocation = otherLocation + this.getInstanceNumForPath(path, idMap);
                    }

                    if(operator && otherLocation){
                        assertion.description = 'The content of ' + subject + ' ' + verb + ' ' + this.configService.getOperatorLable(operator) + ' the content of ' + otherLocation;
                    }
                }else if(complementKey === 'COMPAREVALUE'){
                    let operator, value:string;

                    operator = assertion.complement.operator;
                    value = assertion.complement.value;

                    if(operator && value){
                        assertion.description = 'The content of ' + subject + ' ' + verb + ' ' + this.configService.getOperatorLable(operator) + ' \'' + value + '\'';
                    }
                }else if(complementKey === 'FORMATTED'){
                    let type, regexPattern:string;

                    regexPattern = assertion.complement.regexPattern;
                    type = assertion.complement.type;

                    if(type){
                        assertion.description = 'The content of ' + subject + ' ' + verb + ' ' + this.configService.getFormattedType(type);
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
                    this.generateDescriptionForSimpleAssertion(childAssertion,idMap);
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
                this.generateDescriptionForSimpleAssertion(child,idMap);
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
                this.generateDescriptionForSimpleAssertion(ifAssertion,idMap);
                this.generateDescriptionForSimpleAssertion(thenAssertion,idMap);

                if(!ifAssertion.description) isReady = false;
                if(!thenAssertion.description) isReady = false;

                result = 'IF {' + ifAssertion.description + '}, then {' + thenAssertion.description + '}';
            }
            if(isReady && result){
                assertion.description = result;
            }
        }
    }

    parsePath(path,idMap, result, idPath, separator, end){
        if(result){
            idPath = idPath + '-' + path.elementId;
            result = result + separator + idMap[idPath].position;
            if(path.child) result = this.parsePath(path.child, idMap, result, idPath, '.', end);
            else result = result + '(' + idMap[idPath].name + ')';
        }else {
            idPath = path.elementId;
            result = idMap[path.elementId].name;
            if(path.child) result = this.parsePath(path.child, idMap, result, idPath, separator, end);
            else result = result + '(' + idMap[idPath].name + ')';
        }
        return result;
    }

    getInstanceNumForPath(path, idMap){
        if(this.isRepeatedField(path.elementId, path.child.elementId, idMap)) {
            return ' in ' + this.configService.getInstancLabelByValue(path.child.instanceParameter) + ' occurrence of the Field (' + this.getRepeatedFieldName(path.elementId, path.child.elementId, idMap) + ')';
        }

        return ' ';
    }



    isRepeatedField(segmentElementId, fieldElementId, idMap){
        var fieldObj = idMap[segmentElementId + "-" + fieldElementId];

        if(fieldObj) {
            if(fieldObj.max !== '0' && fieldObj.max !== '1') return true;
        }

        return false;
    }

    getRepeatedFieldName(segmentElementId, fieldElementId, idMap){
        var fieldObj = idMap[segmentElementId + "-" + fieldElementId];

        if(fieldObj) {
            if(fieldObj.max !== '0' && fieldObj.max !== '1') return fieldObj.name;
        }

        return null;
    }

    parseValues(values, result, index, separator){
        if(result){
            result = result + separator + '\'' + values[index] + '\'';
        }else {
            result = '\'' + values[index] + '\'';
        }

        index = index + 1;

        if(values.length - 1 > index) {
            result = this.parseValues(values, result, index, ', ');
        }else if(values.length - 1 === index) {
            result = this.parseValues(values, result, index, ' or ');
        }

        return result;
    }
}