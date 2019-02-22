import {Component, Input, Output, EventEmitter} from "@angular/core";
import {GeneralConfigurationService} from "../../../service/general-configuration/general-configuration.service";

@Component({
  selector : 'usage-col',
  templateUrl : './usage-col.component.html',
  styleUrls : ['./usage-col.component.css']
})

export class UsageColComponent {
  @Input() viewScope: string;
  @Input() sourceId: string;

  @Input() usage: string;
  @Output() usageChange = new EventEmitter<string>();

  @Input() trueUsage: string;
  @Output() trueUsageChange = new EventEmitter<string>();

  @Input() falseUsage: string;
  @Output() falseUsageChange = new EventEmitter<string>();

  @Input() changeItems: any[];
  @Output() changeItemsChange = new EventEmitter<any[]>();

  @Input() idPath : string;

  usages:any;
  cUsages:any;

  onUsageChange() {
    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'USAGE';
    item.propertyValue = this.usage;
    item.changeType = "UPDATE";
    this.changeItems.push(item);
    this.usageChange.emit(this.usage);
    this.changeItemsChange.emit(this.changeItems);
  }

  constructor(private configService : GeneralConfigurationService){}

  ngOnInit(){
    this.usages = this.configService._usages;
    this.cUsages = this.configService._cUsages;
  }

  onTrueUsageChange(){
    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'TRUEUSAGE';
    item.propertyValue = this.trueUsage;
    item.changeType = "UPDATE";
    this.changeItems.push(item);
    this.trueUsageChange.emit(this.trueUsage);
    this.changeItemsChange.emit(this.changeItems);
  }

  onFalseUsageChange(){
    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'FALSEUSAGE';
    item.propertyValue = this.falseUsage;
    item.changeType = "UPDATE";
    this.changeItems.push(item);
    this.falseUsageChange.emit(this.falseUsage);
    this.changeItemsChange.emit(this.changeItems);
  }
}