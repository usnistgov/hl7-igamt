/**
 * Created by Jungyub on 10/23/17.
 */
import {Component} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";

import {DatatypesService} from "../../../../service/datatypes/datatypes.service";
import {IndexedDbService} from "../../../../service/indexed-db/indexed-db.service";

@Component({
  selector : 'datatype-edit',
  templateUrl : './datatype-edit-structure.component.html',
  styleUrls : ['./datatype-edit-structure.component.css']
})
export class DatatypeEditStructureComponent {
  currentUrl:any;
  datatypeId:any;
  datatypeStructure:any;
  usages:any;
  datatypeOptions:any = [];
  valuesetOptions:any = [];
  textDefinitionDialogOpen:boolean = false;
  selectedNode:any;
  valuesetStrengthOptions:any = [];

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
          id:'mock_ARBITRARY_CWE2',
          name: 'CWE',
          exe: 'TXT2',
          label:'CWE_TXT2',
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

  constructor(public indexedDbService: IndexedDbService, private route: ActivatedRoute, private  router : Router, private configService : GeneralConfigurationService, private datatypesService : DatatypesService){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
      }
    });
  }

    ngOnInit() {
        //TODO temp
        this.indexedDbService.initializeDatabase('5a203e2984ae98b394159cb2');

        this.datatypeId = this.route.snapshot.params["datatypeId"];
        this.datatypesService.getDatatypeStructure(this.datatypeId, structure  => {
            this.datatypeStructure = {};
            this.updateDatatype(this.datatypeStructure, structure.children, structure.binding, null, null, null, null);
        });

        this.usages = this.configService._usages;
        this.valuesetStrengthOptions = this.configService._valuesetStrengthOptions;
        for (let dt of this.datatypesLinks) {
            var dtOption = {label: dt.label, value : dt};
            this.datatypeOptions.push(dtOption);
        }
        for (let vs of this.valuesetsLinks) {
            var vsOption = {label: vs.label, value : vs.id};
            this.valuesetOptions.push(vsOption);
        }
    }

    updateDatatype(node, children, currentBinding, parentFieldId, parentDT, componentDT, datatypeBinding){
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
                entry.data.datatypeBinding = this.findBinding(entry.data.idPath, currentBinding);
            }else if(entry.data.idPath.split("-").length === 2){
                entry.data.type = 'SUBCOMPONENT';
                entry.data.componentDT = parentDT;
                entry.data.datatypeBinding = this.findBinding(entry.data.idPath.split("-")[1], datatypeBinding);
                entry.data.componentDTbinding = this.findBinding(entry.data.idPath.split("-")[1], currentBinding);
            }
        }

        node.children = children;
    }

    getValueSetElm(id){
      for(let link of this.valuesetsLinks){
          if(link.id === id) return link;
      }
      return null;
    }

    addNewValueSet(node){
      if(!node.data.segmentBinding) node.data.segmentBinding = [];
      if(!node.data.segmentBinding.valuesetBindings) node.data.segmentBinding.valuesetBindings = [];

        node.data.segmentBinding.valuesetBindings.push({edit:true});
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
                this.updateDatatype(event.node, structure.children, structure.binding, event.node.data.idPath, datatypeId, event.node.data.componentDT, event.node.data.datatypeBinding);
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
            if(dt.id === id) return JSON.parse(JSON.stringify(dt));
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
