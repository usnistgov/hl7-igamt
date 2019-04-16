import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector : 'comment-readonly-col',
  templateUrl : './comment-readonly-col.component.html',
  styleUrls : ['./comment-readonly-col.component.css']
})

export class CommentReadonlyColComponent {
  @Input() bindings: any[];

  allComments: any[];
  constructor(){}

  ngOnInit(){
    this.findAllComments();
  }

  findAllComments(){
    this.allComments = [];
    if(this.bindings){
      for (var i in this.bindings) {
        if(this.bindings[i].comments && this.bindings[i].comments.length > 0){
          for(let c of this.bindings[i].comments){
            c.priority = this.bindings[i].priority;
            this.allComments.push(c);
          }
        }
      }
    }
  }
}