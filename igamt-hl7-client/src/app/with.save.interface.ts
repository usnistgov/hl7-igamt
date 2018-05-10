/**
 * Created by ena3 on 5/10/18.
 */
export interface WithSave{

  save() :any;
  reset(): any;
  getCurrent():any;
  getBackup():any;
  isValid(): boolean;

}
