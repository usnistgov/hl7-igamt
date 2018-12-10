/**
 * Created by hnt5 on 10/4/17.
 */
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {PrimeDialogAdapter} from '../prime-ng-adapters/prime-dialog-adapter';
import {VSValue} from './vsvalue.interface';
import {TocService} from '../../igdocuments/igdocument-edit/service/toc.service';
import {GeneralConfigurationService} from '../../service/general-configuration/general-configuration.service';

@Component({
    selector : 'app-valueset-binding-picker',
    templateUrl : 'valueset-binding-picker.template.html'
})
export class ValueSetBindingPickerComponent extends PrimeDialogAdapter implements OnInit {

    public libraryId = '';
    tables: any;
    selectedTables: any[] = [];
    bindingStrength: any[];
    bindingLocation: any[];
    complex = true;
    coded = false;
    varies = false;
    version = '';

    constructor(private tocService: TocService, private config : GeneralConfigurationService) {
        super();
    }

    select() {
        this.dismissWithData(this.transform(this.selectedTables));
    }

    selectRow(event) {
      if (!this.complex && !this.varies) {
        event.data.bindingLocation = ['.'];
      } else {
        event.data.bindingLocation = null;
      }
      event.data.bindingStrength = null;
      event.data.id = event.data.bindingIdentifier + '-' + event.data.version;
    }

    transform(list) {
        const selected: VSValue[] = [];
        for (const vs of list){
            if (vs.hasOwnProperty('bindingStrength') && vs.hasOwnProperty('bindingLocation')) {
                selected.push({
                    bindingIdentifier : vs.bindingIdentifier,
                    bindingLocation : vs.bindingLocation,
                    bindingStrength : vs.bindingStrength,
                    hl7Version : vs.hl7Version,
                    name : vs.name,
                    scope : vs.scope
                });
            }
        }
        return selected;
    }

    onDialogOpen() {
        const ctrl = this;
        this.tocService.getValueSetList().then(function (tables: any[]) {
          ctrl.tables = [];
          for (const elm of tables){
            ctrl.tables.push({
              name : elm.data.description,
              scope : elm.data.domainInfo.scope,
              hl7Version: elm.data.domainInfo.version,
              bindingIdentifier : elm.data.label
            });
          }
        });
        this.bindingLocation = this.config.getValuesetLocationsForCE(this.version);
        // this.$http.get('api/table-library/' + this.libraryId + '/tables').toPromise().then(function(response) {
        //     ctrl.tables = response.json();
        // });
    }

    ngOnInit() {
        // Load Table
        this.hook(this);
        this.bindingStrength = [
            {
                label : 'R',
                value : 'R'
            },
            {
                label : 'S',
                value : 'S'
            }
        ];

    }

    getScopeLabel(leaf) {
        if (leaf) {
            if (leaf.scope === 'HL7STANDARD') {
                return 'HL7';
            } else if (leaf.scope === 'USER') {
                return 'USR';
            } else if (leaf.scope === 'SDTF') {
                return 'SDTF';
            } else if (leaf.scope === 'PRELOADED') {
                return 'PRL';
            } else if (leaf.scope === 'PHINVADS') {
                return 'PVS';
            } else {
                return '';
            }
        }
    }
    hasSameVersion(element) {
        if (element) {
          return element.hl7Version;
        }
        return null;
    }
}
