import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector : 'comment-col',
  templateUrl : './comment-col.component.html',
  styleUrls : ['./comment-col.component.css']
})

export class CommentColComponent {
  @Input() bindings: any[];
  @Output() bindingsChange = new EventEmitter<any[]>();
  @Input() idPath : string;
  @Input() changeItems: any[];
  @Input() viewScope: string;
  @Input() sourceId : string;
  @Output() changeItemsChange = new EventEmitter<any[]>();

  allComments: any[];
  newComment:string;
  commentAddDialogOpen:boolean = false;

  constructor(){}

  ngOnInit(){
    this.findAllComments();
  }

  openCommentAddDialog(){
    this.commentAddDialogOpen = true;
    this.newComment = null;
  }

  addComment(){
    if(!this.bindings) this.bindings = [];
    var binding = this.findTargetBinding();
    if(!binding) {
      binding = {};
      binding.priority = 1;
      binding.sourceType = this.viewScope;
      binding.sourceId = this.sourceId;
      this.bindings.push(binding);
    }
    if(!binding.comments) binding.comments = [];
    let tobeChanged:any = {};
    tobeChanged.description = this.newComment;

    let displayC:any = {};
    displayC.description = this.newComment;
    displayC.priority = 1;

    binding.comments.push(tobeChanged);
    this.allComments.push(displayC);
    this.bindingsChange.emit(this.bindings);

    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'COMMENT';
    item.propertyValue = binding.comments;
    item.changeType = "UPDATE";
    this.changeItems.push(item);
    this.changeItemsChange.emit(this.changeItems);
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

  findTargetBinding(){
    if(this.bindings){
      for (var i in this.bindings) {
        if(this.bindings[i].priority === 1) return this.bindings[i];
      }
      return null;
    }
  }
}