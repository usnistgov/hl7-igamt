import { Injectable } from '@angular/core';
import {GeneralConfigurationService} from "../../service/general-configuration/general-configuration.service";

@Injectable()
export class ConstraintsService {

    constructor(private configService : GeneralConfigurationService) {}

    generateDescriptionForSimpleAssertion(assertion, idMap){
        if(assertion.mode === 'SIMPLE'){

            let subject,verb,complementKey:string;

            if(assertion.subject && assertion.subject.path){
                subject = this.parsePath(assertion.subject.path, idMap, null, null, '-');
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
                        assertion.description = subject + ' ' + verb + ' contain the constant value \'' + value + '\'' + ((casesensitive) ? '(case-sensitive).' : '(case-insensitive)');
                    }
                }else if(complementKey === 'LISTVALUE'){
                    let values:string[];
                    values = assertion.complement.values;

                    if(values && values.length > 0){
                        assertion.description = subject + ' ' + verb + ' contain one of the values ' + this.parseValues(values, null, 0, null);
                    }
                }else if(complementKey === 'PRESENCE'){
                    assertion.description = subject + ' ' + verb + ' presence';
                }else if(complementKey === 'COMPARENODE'){
                    //The content of LOCATION 1 (DESCRIPTION) SHALL be identical to the content of LOCATION 2 (DESCRIPTION).
                    let operator, otherLocation:string;
                    let path:any;

                    operator = assertion.complement.operator;
                    path = assertion.complement.path;

                    if(path) otherLocation = this.parsePath(path, idMap, null, null, '-');

                    if(operator && otherLocation){
                        assertion.description = 'The content of ' + subject + ' ' + verb + ' ' + this.configService.getOperatorLable(operator) + ' ' + otherLocation;
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

    parsePath(path,idMap, result, idPath, separator){
        if(result){
            idPath = idPath + '-' + path.elementId;
            result = result + separator + idMap[idPath].position + ((path.instanceParameter && path.instanceParameter === '1') ? '' : '[' + path.instanceParameter + ']') ;
            if(path.child) result = this.parsePath(path.child, idMap, result, idPath, '.');
            else result = result + '(' + idMap[idPath].name + ')';
        }else {
            idPath = path.elementId;
            result = idMap[path.elementId].name;
            if(path.child) result = this.parsePath(path.child, idMap, result, idPath, separator);
            else result = result + '(' + idMap[idPath].name + ')';
        }
        return result;
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