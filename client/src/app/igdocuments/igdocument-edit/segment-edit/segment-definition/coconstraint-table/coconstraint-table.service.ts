import {Injectable} from "@angular/core";
import {CoConstraintTable, CCSelectorType} from "./coconstraint.domain";
import {Http} from "@angular/http";
/**
 * Created by hnt5 on 10/11/17.
 */

@Injectable()
export class CoConstraintTableService {

    constructor(private $http : Http){}

    getCCTableForSegment(segment : any) : CoConstraintTable {
        if(!segment) {
            return null;
        }
        else {
            if(segment.name === 'OBX')
                return this.generate_obx_table(segment);
            else
                return this.generate_generic_table();
        }

    }

    generate_generic_table() : CoConstraintTable {
        return {
            grp : false,
            dyn : false,
            headers : {
                selectors : [],
                data : [],
                user : []
            },
            content : {
                free : [],
                groups : []
            }
        };
    }

    generate_obx_table(segment : any) : CoConstraintTable {
        let tmp = this.generate_generic_table();
        tmp.grp = true;
        tmp.dyn = true;
        tmp.headers.selectors.push({
            id : 'k3',
            label : 'OBX-3',
            keep : true,
            content : {
                type : CCSelectorType.ByCode,
                elmType : 'field',
                path : '3[1]'
            }
        });
        tmp.headers.selectors.push({
            id : 'k2',
            label : 'OBX-2',
            keep : true,
            content : {
                type : CCSelectorType.DataType,
                elmType : 'field',
                path : '2[1]'
            }
        });
        tmp.headers.data.push({
            id : 'k5',
            label : 'OBX-5',
            keep : true,
            content : {
                type : CCSelectorType.DatatypeFlavor,
                elmType : 'field',
                path : '5[1]'
            }
        });
        return tmp;
    }

    async get_bound_codes(segment : any){
        if(segment && segment.valueSetBindings){
            for(let binding of segment.valueSetBindings){
                if(binding.location === '2'){
                    return this.$http.get('api/tables/' + binding.tableId).toPromise();
                }
            }
        }
    }

    async fetchCoConstraintTable(id : string)  {
        return null;
    }

    new_line(selectors : any[], data : any[], user : any[]){
        let row = {};
        for(let header of selectors){
            this.initCell(row, header);
        }
        for(let header of data){
            this.initCell(row, header);
        }
        for(let header of user){
            this.initCell(row, header);
        }
        this.init_req(row);
        return row;
    }

    init_req(row){
        row.requirements = {
            usage : 'R',
                cardinality : {
                min : 1,
                    max : "1"
            }
        }
    }

    initCell(obj, header){
        if(!header.content){
            obj[header.id] = {
                value : ''
            };
            return;
        }
        switch(header.content.type){

            case CCSelectorType.ByValue :
                obj[header.id] = {
                    value : ''
                };
                break;

            case CCSelectorType.ByValueSet :
                obj[header.id]  = [];
                break;

            case CCSelectorType.DataType :
                obj[header.id]  = {
                    value : ''
                };
                break;
            case CCSelectorType.DatatypeFlavor :
              obj[header.id]  = {
                value : ''
              };
              break;
            case CCSelectorType.ByCode :
                obj[header.id]  = {
                    value : '',
                    location : '1'
                };
                break;
            default :
                obj[header.id] = {
                    value : ''
                };
                break;
        }
    }

    // this.table = {
    // headers : {
    //     selectors : [
    //         {
    //             id : 'k3d1',
    //             label: 'OBX-3.1',
    //             content: {
    //                 path: '3[1].1[1]',
    //                 elmType: 'component',
    //                 type: CCSelectorType.ByValue
    //             },
    //         }
    //     ],
    //     data : [
    //         {
    //             id : 'k5d1',
    //             label: 'OBX-5.1',
    //             content: {
    //                 path: '5[1].1[1]',
    //                 elmType: 'component',
    //                 type: CCSelectorType.ByValue
    //             },
    //         }
    //     ],
    //     user : [
    //         {
    //             id: 'u1',
    //             label: 'Comments',
    //         }
    //     ]
    // },
    // content : {
    //     groups : [
    //         {
    //             data : {
    //                 name : 'Group Name',
    //                 requirements : {
    //                     usage: 'O',
    //                     cardinality: {
    //                         min: 0,
    //                         max: '1'
    //                     }
    //                 }
    //             },
    //             content : {
    //                 free : [
    //                     {
    //                         // k3d1: {
    //                         //     value: '34334-3',
    //                         // },
    //                         k5d1: {
    //                             value: '34334-3',
    //                         },
    //                         u1: {
    //                             value: 'My Comment',
    //                         },
    //                         requirements : {
    //                             usage: 'O',
    //                             cardinality: {
    //                                 min: 0,
    //                                 max: '1'
    //                             }
    //                         }
    //                     }
    //                 ]
    //             }
    //         }
    //     ],
    //     free : [
    //         {
    //             k3d1: {
    //                 value: '34334-3',
    //             },
    //             k5d1: {
    //                 value: '34334-3',
    //             },
    //             u1: {
    //                 value: 'My Comment',
    //             },
    //             requirements : {
    //                 usage: 'O',
    //                 cardinality: {
    //                     min: 0,
    //                     max: '1'
    //                 }
    //             }
    //         }
    //     ]
    // }};


}
