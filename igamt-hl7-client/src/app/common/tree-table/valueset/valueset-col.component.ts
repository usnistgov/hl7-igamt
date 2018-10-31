import {Component, Input, Output, EventEmitter} from "@angular/core";
import {GeneralConfigurationService} from "../../../service/general-configuration/general-configuration.service";

@Component({
  selector : 'valueset-col',
  templateUrl : './valueset-col.component.html',
  styleUrls : ['./valueset-col.component.css']
})

export class ValuesetColComponent {
  @Input() usage: string;
  @Input() viewScope: string;
  @Input() sourceId: string;
  @Output() usageChange = new EventEmitter<string>();

  @Input() bindings: any[];
  @Output() bindingsChange = new EventEmitter<any[]>();

  @Input() idPath : string;

  usages:any;
  cUsages:any;

  currentPredicate:any;
  currentPredicatePriority:number = 100;
  currentPredicateSourceId:any;
  currentPredicateSourceType:any;

  onUsageChange() {
    this.usageChange.emit(this.usage);
    if(this.usage === 'C') this.setPredicate();
    else if(this.usage !== 'C') this.deletePredicate();
    this.bindingsChange.emit(this.bindings);
  }

  constructor(private configService : GeneralConfigurationService){}

  ngOnInit(){
    this.usages = this.configService._usages;
    this.cUsages = this.configService._cUsages;
    if(this.bindings){
      for (var i in this.bindings) {
        if(this.bindings[i].predicate){
          if(this.bindings[i].priority < this.currentPredicatePriority){
            this.currentPredicatePriority = this.bindings[i].priority;
            this.currentPredicate = this.bindings[i].predicate;
            this.currentPredicateSourceId = this.bindings[i].sourceId;
            this.currentPredicateSourceType = this.bindings[i].sourceType;
          }
        }
      }
    }
  }

  setPredicate(){
    if(!this.bindings) this.bindings = [];

    var binding:any = this.findBindingByViewScope();
    if(!binding) {
      binding = {};
      binding.priority = 1;
      binding.sourceId = this.sourceId;
      binding.sourceType = this.viewScope;
      this.bindings.push(binding);
    }

    if(!binding.predicate) binding.predicate = {};

    this.currentPredicate = binding.predicate;
    this.currentPredicatePriority = 1;
    this.currentPredicateSourceId = this.sourceId;
    this.currentPredicateSourceType = this.viewScope;
  }

  deletePredicate(){
    if(this.bindings){
      var binding:any = this.findBindingByViewScope();
      if(binding) {
        binding.predicate = null;
        this.currentPredicate = binding.predicate;
        this.currentPredicatePriority = null;
        this.currentPredicateSourceId = null;
        this.currentPredicateSourceType = null;
      }
    }
  }

  findBindingByViewScope(){
    for (var i in this.bindings) {
      if(this.bindings[i].sourceType === this.viewScope) return this.bindings[i];
    }
    return null;
  }
}