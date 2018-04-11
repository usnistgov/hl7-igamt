import {ApiResponseStatus} from "../enums/api-response-status.enum";
/**
 * Created by hnt5 on 10/19/17.
 */
export class ApiResponse {
  status  : ApiResponseStatus;
  message : string;
  embded? : any;
}
