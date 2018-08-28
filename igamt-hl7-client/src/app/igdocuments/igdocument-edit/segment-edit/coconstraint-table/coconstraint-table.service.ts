import {Injectable} from '@angular/core';
import {
    CoConstraintTable, CCSelectorType, CellTemplate, CCHeader, CCRow, DataCell,
    VSCell, CodeCell, VariesCell, CCCell
} from './coconstraint.domain';
import {Http} from '@angular/http';
import {UUID} from 'angular2-uuid';
import * as _ from 'lodash';
import {TocService} from '../../service/toc.service';

/**
 * Created by hnt5 on 10/11/17.
 */

@Injectable()
export class CoConstraintTableService {

    constructor(private $http: Http,
                private tocService: TocService) {}

    async getCCTableForSegment(segment: any): Promise<CoConstraintTable> {
        if (!segment) {
            return null;
        } else {
            const table: CoConstraintTable = this.fetch_coconstraint_table(segment.id);
            if (!table) {
                if (segment.name === 'OBX') {
                  return await this.generate_obx_table(segment);
                }
                else {
                  return this.generate_generic_table(segment.name);
                }
            }
            else
                return table;

        }

    }

    generate_generic_table(name: string): CoConstraintTable {
        return {
            supportGroups : false,
            segment : name,
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


    async generate_obx_table(segment: any): Promise<CoConstraintTable> {
        const tmp: CoConstraintTable = this.generate_generic_table(segment.name);
        const obx3 = _.find(segment.children, function (child) {
          return child.data.position === 3;
        });
        const obx2 = _.find(segment.children, function (child) {
          return child.data.position === 2;
        });

        const obx3_dt = await this.tocService.getDatatypeById(obx3.data.ref.id);
        const obx2_dt = await this.tocService.getDatatypeById(obx2.data.ref.id);


        tmp.supportGroups = true;
        tmp.headers.selectors.push({
            id : 'k3',
            label : 'OBX-3',
            keep : true,
            content : {
                type : CCSelectorType.CODE,
                elmType : 'field',
                path : '3[1]',
                version : obx3_dt.data.domainInfo.version,
                coded : true,
                complex : true
            }
        });
        tmp.headers.data.push({
            id : 'k2',
            label : 'OBX-2',
            keep : true,
            template : CellTemplate.DATATYPE,
            content : {
                type : CCSelectorType.VALUE,
                elmType : 'field',
                path : '2[1]',
                version : obx2_dt.data.domainInfo.version,
                coded : false,
                complex : false
            }
        });
        tmp.headers.data.push({
            id : 'k2p1',
            label : 'OBX-2',
            keep : true,
            template : CellTemplate.FLAVOR,
            content : {
                type : CCSelectorType.IGNORE,
                elmType : 'field',
                path : '5[1]'
            }
        });
        tmp.headers.user.push({
            id: 'xxx',
            label: 'Comments',
            template: CellTemplate.TEXTAREA
        });
        return tmp;
    }

    async get_bound_codes(segment: any){
        if (segment && segment.valueSetBindings){
            for (const binding of segment.valueSetBindings){
                if (binding.location === '2'){
                    return this.$http.get('api/tables/' + binding.tableId).toPromise();
                }
            }
        }
    }

    fetch_coconstraint_table(id: string)  {
        return null;
    }

    new_line(selectors: any[], data: any[], user: any[]){
        const row: CCRow = {
            id : UUID.UUID(),
            cells : {},
            requirements : null
        };
        this.init_req(row);

        for (const header of selectors){
            this.init_cell(row, header);
        }
        for (const header of data){
            this.init_cell(row, header);
        }
        for (const header of user){
            this.init_cell(row, header);
        }

        return row;
    }

    init_req(row){
        row.requirements = {
            usage : 'R',
                cardinality : {
                min : 1,
                    max : '1'
            }
        };
    }

    init_cell(row: CCRow, header: CCHeader){

        // --- USER
        if (!header.content){
            row.cells[header.id] = <DataCell> {
                value : '',
                type  : header.template
            };
            return;
        }

        // --- RELEVANT FIELD
        let tmpl: string;

        if (header.content.type && header.content.type === CCSelectorType.IGNORE){
            tmpl = header.template;
        }
        else {
            tmpl = header.content.type;
        }

        switch (tmpl){

            case CCSelectorType.VALUE :
            case CellTemplate.DATATYPE :
            case CellTemplate.FLAVOR :

                row.cells[header.id] = <DataCell> {
                    value : '',
                    type : header.content.type
                };
                break;

            case CCSelectorType.VALUESET :
                row.cells[header.id]  = <VSCell> {
                    vs : [],
                    type : header.content.type
                };
                break;

            case CCSelectorType.CODE :
                row.cells[header.id]  = <CodeCell> {
                    value : '',
                    location : [1],
                    type : header.content.type
                };
                break;

            case CellTemplate.VARIES :
                row.cells[header.id]  = <VariesCell> {
                    type : header.content.type,
                    value : <CCCell>{}
                };
                break;
        }
    }


}
