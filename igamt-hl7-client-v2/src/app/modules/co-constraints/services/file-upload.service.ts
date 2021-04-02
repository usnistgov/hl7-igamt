
import { Injectable } from '@angular/core'; 
import {HttpClient} from '@angular/common/http'; 
import {Observable} from 'rxjs'; 
import { Message } from '../../dam-framework/models/messages/message.class';
@Injectable({ 
  providedIn: 'root'
}) 
export class FileUploadService { 
    
  // API url 
  BackEndUploadEndPoint = "/api/import/coconstraintTable"
    
  constructor(private http:HttpClient) { } 
  
  // Returns an observable 
  upload(file, segmentID, conformanceProfileID, igID, pathID):Observable<any> { 
  
      // Create form data 
      const formData = new FormData();  
        
      // Store form name as "file" with file data 
      formData.append("file", file); 
      formData.append("segmentID", segmentID); 
      formData.append("conformanceProfileID", conformanceProfileID); 
      formData.append("igID", igID); 
      formData.append("pathID", pathID); 



        
      // Make http post request over api 
      // with formData as req 
      console.log("in service file name is :", file.name);
      return this.http.post<Message<any>>(this.BackEndUploadEndPoint, formData) 
  } 
} 