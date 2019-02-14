/**
 * Created by hnt5 on 10/26/17.
 */
import {Component, Input} from "@angular/core";
@Component({
  selector : 'predicate-readonly-col',
  templateUrl : './predicate-readonly-col.component.html',
  styleUrls : ['./predicate-readonly-col.component.css']
})
export class PredicateReadonlyColComponent {
  @Input() usage: string;
  @Input() bindings: any[];
  @Input() idPath : string;

  currentPredicate:any;
  currentPredicatePriority:number = 100;
  currentPredicateSourceId:any;
  currentPredicateSourceType:any;

  constructor(){}
  ngOnInit(){
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
}