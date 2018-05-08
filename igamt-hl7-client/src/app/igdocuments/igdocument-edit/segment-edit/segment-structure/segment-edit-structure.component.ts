/**
 * Created by Jungyub on 10/23/17.
 */
import {Component} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";

import {SegmentsService} from "../../../../service/segments/segments.service";
import {DatatypesService} from "../../../../service/datatypes/datatypes.service";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";

@Component({
  selector : 'segment-edit',
  templateUrl : './segment-edit-structure.component.html',
  styleUrls : ['./segment-edit-structure.component.css']
})
export class SegmentEditStructureComponent {
  currentUrl:any;
  segmentId:any;
  segmentStructure:any;
  usages:any;
  datatypeOptions:any = [];
  textDefinitionDialogOpen:boolean = false;
  selectedNode:any;

  valuesetsLinks :any = [
      {
          id:'AAAAA',
          bindingIdentifier: 'HL70001_IZ',
          label:'HL70001',
          domainInfo:{
              scope:'USER',
              version:'2.4'
          }
      },
      {
          id:'BBBBB',
          bindingIdentifier: 'HL70002_IZ',
          label:'HL70002',
          domainInfo:{
              scope:'USER',
              version:'2.4'
          }
      },
      {
          id:'CCCCC',
          bindingIdentifier: 'HL70003_IZ',
          label:'HL70003',
          domainInfo:{
              scope:'USER',
              version:'2.4'
          }
      },
      {
          id:'DDDDD',
          bindingIdentifier: 'HL70004_IZ',
          label:'HL70004',
          domainInfo:{
              scope:'USER',
              version:'2.4'
          }
      }

  ];
  datatypesLinks :any = [
      {
          id:'mock_ARBITRARY_CWE',
          name: 'CWE',
          exe: 'TXT',
          label:'CWE_TXT',
          domainInfo:{
              scope:'USER',
              version:'2.4'
          },
          leaf:false
      },
      {
          id:'mock_ARBITRARY_ID',
          name: 'ID',
          label:'ID',
          domainInfo:{
              scope:'HL7STANDARD',
              version:'2.4'
          },
          leaf:true
      },
      {
          id:'mock_ARBITRARY_SI',
          name: 'SI',
          label:'SI',
          domainInfo:{
              scope:'HL7STANDARD',
              version:'2.4'
          },
          leaf:true
      },
      {
          id:'mock_ARBITRARY_ST',
          name: 'ST',
          label:'ST',
          domainInfo:{
              scope:'HL7STANDARD',
              version:'2.4'
          },
          leaf:true
      },
      {
          id:'mock_ARBITRARY_XCN',
          name: 'XCN',
          label:'XCN',
          domainInfo:{
              scope:'HL7STANDARD',
              version:'2.4'
          },
          leaf:false
      }
      ];

  constructor(public indexedDbService: IndexedDbService, private route: ActivatedRoute, private  router : Router, private configService : GeneralConfigurationService, private segmentsService : SegmentsService, private datatypesService : DatatypesService){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
      }
    });
  }

    ngOnInit() {
        //TODO temp
        this.indexedDbService.initializeDatabase('5a203e2984ae98b394159cb2');

        this.segmentId = this.route.snapshot.params["segmentId"];
        this.segmentsService.getSegmentStructure(this.segmentId, structure  => {
            this.segmentStructure = {};
            this.updateDatatype(this.segmentStructure, structure.children, structure.binding, null, null, null, null, null);
        });

        this.usages = this.configService._usages;
        for (let dt of this.datatypesLinks) {
            var dtOption = {label: dt.label, value : dt};
            this.datatypeOptions.push(dtOption);
        }
    }

    updateDatatype(node, children, currentBinding, parentFieldId, parentDT, fieldDT, segmentBinding, fieldDTbinding){
        for (let entry of children) {
            entry.data.datatype = this.getDatatypeLink(entry.data.ref.id);
            entry.data.valuesetAllowed = this.configService.isValueSetAllow(entry.data.datatype.name,entry.data.position, null, null, entry.data.type);
            if(entry.data.valuesetAllowed) entry.data.multipleValuesetAllowed =  this.configService.isMultipleValuseSetAllowed(entry.data.datatype.name);
            if(entry.data.datatype.leaf) entry.leaf = true;
            else entry.leaf = false;

            if(parentFieldId === null){
                entry.data.idPath = entry.data.id;
            }else{
                entry.data.idPath = parentFieldId + '-' + entry.data.id;
            }

            if(entry.data.idPath.split("-").length === 1){
                entry.data.segmentBinding = this.findBinding(entry.data.idPath, currentBinding);
            }else if(entry.data.idPath.split("-").length === 2){
                entry.data.type = 'COMPONENT';
                entry.data.fieldDT = parentDT;
                entry.data.segmentBinding = this.findBinding(entry.data.idPath.split("-")[1], segmentBinding);
                entry.data.fieldDTbinding = this.findBinding(entry.data.idPath.split("-")[1], currentBinding);
            }else if(entry.data.idPath.split("-").length === 3){
                entry.data.type = "SUBCOMPONENT";
                entry.data.fieldDT = fieldDT;
                entry.data.componentDT = parentDT;
                entry.data.segmentBinding = this.findBinding(entry.data.idPath.split("-")[2], segmentBinding);
                entry.data.fieldDTbinding = this.findBinding(entry.data.idPath.split("-")[2], fieldDTbinding);
                entry.data.componentDTbinding = this.findBinding(entry.data.idPath.split("-")[2], currentBinding);
            }
        }

        node.children = children;
    }

    updateValueSetBindings(binding){
      if(binding && binding.valuesetBindings){
          for(let vs of binding.valuesetBindings){
              vs = this.getValueSetLink(vs);
          }
      }
      return binding;
    }

    findBinding(id, binding){
      if(binding && binding.children){
          for(let b of binding.children){
              if(b.elementId === id) return this.updateValueSetBindings(b);
          }
      }

      return null;
    }

    delLength(node){
        node.data.minLength = 'NA';
        node.data.maxLength = 'NA';
        node.data.confLength = '';
    }

    delConfLength(node){
        node.data.minLength = '';
        node.data.maxLength = '';
        node.data.confLength = 'NA';
    }

    makeEditModeBasic(node){
      node.data.datatype.editMode = 'basic';
      node.data.dtOptions = [];

      for (let dt of this.datatypesLinks) {
            if(dt.name === node.data.datatype.name){
                var dtOption = {label: dt.label, value : dt};
                node.data.dtOptions.push(dtOption);
            }
        }
        node.data.dtOptions.push({label: 'Change Datatype root', value : node.data.datatype});

    }

    makeEditModeAll(node){
        node.data.datatype.editMode = 'all';
    }

    loadNode(event) {
        if(event.node && !event.node.children) {
            var datatypeId = event.node.data.ref.id;
            this.datatypesService.getDatatypeStructure(datatypeId, structure  => {
                this.updateDatatype(event.node, structure.children, structure.binding, event.node.data.idPath, datatypeId, event.node.data.fieldDT, event.node.data.segmentBinding, event.node.data.fieldDTBinding);
            });
        }
    }

    onDatatypeChange(node){
      node.children = null;
      node.data.ref.id = node.data.datatype.id;
      node.expanded = false;
      if(node.data.datatype.leaf) node.leaf = true;
      else node.leaf = false;
    }

    delTextDefinition(node){
      node.data.text = null;
    }

    getDatatypeLink(id){
        for (let dt of this.datatypesLinks) {
            if(dt.id === id) return dt;
        }
        console.log("Missing:::" + id);
        return null;
    }

    getValueSetLink(vs){
      for(let v of this.valuesetsLinks) {
          if(v.id === vs.valuesetId) {
              console.log(v);
              vs.bindingIdentifier = v.bindingIdentifier;
              vs.domainInfo = v.domainInfo;
              vs.label = v.label;

              return vs;
          }
      }
      return null;
    }

    editTextDefinition(node){
      this.selectedNode = node;
      this.textDefinitionDialogOpen = true;
    }

    truncate(txt){
      if(txt.length < 10) return txt;
      else return txt.substring(0,10) + "...";
    }
}
