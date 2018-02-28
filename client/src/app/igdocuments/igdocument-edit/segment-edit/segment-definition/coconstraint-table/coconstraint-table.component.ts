/**
 * Created by hnt5 on 10/3/17.
 */

import {Component, Input, ViewChild, TemplateRef} from "@angular/core";
import {CoConstraintTable, CCSelectorType} from "./coconstraint.domain";
import {CCHeaderDialogDm} from "./header-dialog/header-dialog-dm.component";
import {CoConstraintTableService} from "./coconstraint-table.service";
import {CCHeaderDialogUser} from "./header-dialog/header-dialog-user.component";
import {ValueSetBindingPickerComponent} from "../../../../../common/valueset-binding-picker/valueset-binding-picker.component";
import {Http} from "@angular/http";
import {WorkspaceService, Entity} from "../../../../../service/workspace/workspace.service";
@Component({
  selector: 'coconstraint-table',
  templateUrl: 'coconstraint-table.template.html',
  styleUrls: ['coconstraint-table.component.css']
})

export class CoConstraintTableComponent {

  @Input() dtlist: any[];
  @Input() tableid: any;

  @ViewChild(ValueSetBindingPickerComponent) vsPicker: ValueSetBindingPickerComponent;
  @ViewChild(CCHeaderDialogDm) headerDialogDm: CCHeaderDialogDm;
  @ViewChild(CCHeaderDialogUser) headerDialogUser: CCHeaderDialogUser;
  @ViewChild('empty')
  empty: TemplateRef<any>;
  @ViewChild('value')
  value: TemplateRef<any>;
  @ViewChild('valueset')
  valueset: TemplateRef<any>;
  @ViewChild('datatype')
  datatype: TemplateRef<any>;
  @ViewChild('flavor')
  flavor: TemplateRef<any>;
  @ViewChild('textArea')
  textArea: TemplateRef<any>;
  @ViewChild('code')
  code: TemplateRef<any>;

  table: CoConstraintTable;
  config: any;
  _segment: any;

  constructor(private ccTableService: CoConstraintTableService,
              private http : Http,
              private _ws : WorkspaceService) {
  }

  @Input() set segment(value: any) {
    this._segment = value;
    this.table = this.ccTableService.getCCTableForSegment(this._segment);
    let ctrl = this;
    if (this.table.dyn) {
      this.ccTableService.get_bound_codes(this._segment).then(function (response) {
        ctrl.config.dynCodes = [];
        console.log(response.json());
        for (let code of response.json().codes) {
          ctrl.config.dynCodes.push({label: code.value, value: code.value});
        }

      });
    }
  }

  template(node) {
    if (node && node.content && node.content.type) {
      switch (node.content.type) {
        case CCSelectorType.ByValue :
          return this.value;
        case CCSelectorType.ByValueSet :
          return this.valueset;
        case CCSelectorType.DataType :
          return this.datatype;
        case CCSelectorType.ByCode :
          return this.code;
        case CCSelectorType.DatatypeFlavor :
          return this.flavor;
      }
    }
    else if (node && node.label) {
      return this.textArea;
    }
    else
      return this.empty;
  }

  openVSDialog(obj, key) {
    this.vsPicker.open({
      libraryId: this.tableid,
      selectedTables: obj[key]
    }).subscribe(
      result => {
        console.log(result);
        obj[key] = result;
      }
    );
  }

  openHeaderDialog(h) {
    let resolve = {
      header: h,
      selectedPaths: [],
      type: null,
      fixed: false
    };

    if (h === 'selectors') {
      resolve.type = CCSelectorType.ByValue;
      resolve.fixed = true;
    }

    this.headerDialogDm.open(resolve).subscribe(
      result => {
        this.table.headers[h].push(result);
        this.initColumn(result);
      }
    );
  }

  openUserHeaderDialog() {
    this.headerDialogUser.open({}).subscribe(
      result => {
        this.table.headers.user.push(result);
        this.initColumn(result);
      }
    );
  }

  initCell(type, obj, key) {
    switch (type) {

      case CCSelectorType.ByValue :
        obj[key] = {
          value: ''
        };
        break;

      case CCSelectorType.ByValueSet :
        obj[key] = [];
        break;

      case CCSelectorType.DataType :
        obj[key] = {
          value: '',
          dt: ''
        };
        break;
      case CCSelectorType.ByCode :
        obj[key] = {
          value: '',
          location: ''
        };
        break;
    }
  }

  delCol(list: any[], i: number, column: string) {
    this.reqDel(this.table, column);
    list.splice(i, 1);

  }

  reqDel(obj, key) {
    if (obj.content.free) {
      for (let cc of obj.content.free) {
        delete cc[key];
      }
    }
    if (obj.content.groups) {
      for (let gr of obj.content.groups) {
        this.reqDel(gr, key);
      }
    }
  }

  delRow(list: any[], i: number) {
    list.splice(i, 1);
  }

  addCc(list: any[]) {
    list.push(this.ccTableService.new_line(this.table.headers.selectors, this.table.headers.data, this.table.headers.user));
  }

  initColumn(obj) {

    let ctrl = this;
    let initReq = function (table) {
      if (table.content.free) {
        for (let cc of table.content.free) {
          ctrl.ccTableService.initCell(cc, obj);
          //ctrl.initCell(obj.content.type, cc, obj.id);
        }
      }
      if (table.content.groups) {
        for (let grp of table.content.groups) {
          initReq(grp);
        }
      }
    };
    initReq(this.table);
  }

  addCcGroup() {
    this.table.content.groups.push({
      data: {
        name: '',
        requirements: {
          usage: 'R',
          cardinality: {
            min: 1,
            max: "1"
          }
        }
      },
      content: {
        free: []
      }
    });
  }

  delGroup(list: any[], i: number) {
    list.splice(i, 1);
  }

  dtChange(node) {
    node.value = '';
  }

  groupHeaderSize(table) {
    let data = table.headers.data.length === 0 ? 1 : table.headers.data.length;
    let selector = table.headers.selectors.length === 0 ? 1 : table.headers.selectors.length;
    let user = table.headers.user.length === 0 ? 1 : table.headers.user.length;
    return data + selector + user;
  }

  ngOnInit() {
    this.config = {
      selectorTypes: [
        {
          label: "Constant",
          value: CCSelectorType.ByValue
        },
        {
          label: "Value Set",
          value: CCSelectorType.ByValue
        }
      ],
      usages: [
        {
          label: "R",
          value: "R"
        },
        {
          label: "O",
          value: "O"
        }
      ],
      dynCodes: [],
      datatypes: []
    };
    this.readRoute();
  }

  readRoute() {
    this._ws.getCurrent(Entity.IG).subscribe( data =>{
      let ig =data;
      this.tableid = ig.profile.tableLibrary.id;

      this._ws.getCurrent(Entity.SEGMENT).subscribe(seg =>{
        this.segment= seg;
        for(let dt of ig.profile.datatypeLibrary.children){
          this.config.datatypes.push({ label : dt.label, value : dt});
        }
      })
    })

    //
    //
    // let ig = this._ws.getCurrent(Entity.IG);
    // this.tableid = ig.profile.tableLibrary.id;
    // this.segment = this._ws.getCurrent(Entity.SEGMENT);
    // for(let dt of ig.profile.datatypeLibrary.children){
    //   this.config.datatypes.push({ label : dt.label, value : dt});
    // }
    // console.log(this.config);
  }
}
