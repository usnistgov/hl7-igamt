import {NgForm} from "@angular/forms";
/**
 * Created by ena3 on 7/30/18.
 */
export class HasFroala {


  getOptions(form:NgForm) {

    return  {
      placeholder: "Edit Me",
      events: {
        'froalaEditor.focus': function (e, editor) {
          console.log(form);
          form.form.markAsDirty();
        }
      }
    }
  }
}
