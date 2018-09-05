import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DatatypeEvolutionService} from "./datatype-evolution.service";

@Component({
  selector: 'app-datatype-evolution',
  templateUrl: './datatype-evolution.component.html',
  styleUrls: ['./datatype-evolution.component.css']
})
export class DatatypeEvolutionComponent implements OnInit {

  constructor(private  ac :ActivatedRoute, private datatypeEvolutionService:DatatypeEvolutionService) { }

   classes:any;
  firstVersion:any;
  secondVersion:any;

  tableValue:any;
  selectedName:any;
  matrix:any;
  headers= [
    "#",
    "2.3.1",
    "2.4",
    "2.5",
    "2.5.1",
    "2.6",
    "2.7",
    "2.7.1",
    "2.8",
    "2.8.1",
    "2.8.2"
  ];

  criterias=[


    {"label":"Name" ,"value": "CPNUMBER"},
    {"label":"Min.Length" ,"value": "MINLENGTH"},

    {"label":"MAXLENGTH" ,"value": "MAXLENGTH"},
    {"label":"Conf.Length" ,"value": "CONFLENGTH"},
    {"label":"DATATYPE" ,"value": "CPDATATYPE"}

    ];


  ngOnInit() {
    console.log("calling on init ");


    this.ac.data.map(data =>data.matrix).subscribe(x=>{
      this.classes= x;
      this.matrix=this.buildMatrix(this.classes);
    });



  }







  buildMatrix(classes){
    var result:any[]=[];

      for(let i=0; i<classes.length; i++){
        let obj:any={};
        obj["#"]=classes[i].name;

        for(let j=0; j < classes[i].classes.length; j++) {

          for(let v=0; v<classes[i].classes[j].versions.length; v++){

              obj[classes[i].classes[j].versions[v]]=classes[i].classes[j].position;


          }
        }
        result.push(obj);
      }
      console.log(result);
      return result;
  }



  compareOrSelect(name,version){
    console.log(name);
    console.log(version);

    if(this.selectedName){
      if(name ==this.selectedName){

        if(version==this.firstVersion||version==this.secondVersion){
          this.firstVersion=null;
          this.selectedName=null;
          this.secondVersion=null;
        }else{
          this.secondVersion=version;
          this.tableValue=null;
          this.datatypeEvolutionService.compare(name,this.firstVersion,this.secondVersion).subscribe(x=>{
           this.tableValue=x;
          }, error =>{



          })
        }
      }else{
        this.selectedName=name;
        this.firstVersion=version;
        this.secondVersion=null;
      }

    }else{

      this.selectedName=name;
      this.firstVersion=version;
      this.secondVersion=null;
    }




  }

  print(obj, col){
    console.log(obj);
    console.log(col);

  }




}
