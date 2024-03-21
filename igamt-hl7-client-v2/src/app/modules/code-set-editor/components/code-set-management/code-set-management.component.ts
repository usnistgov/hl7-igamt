import { ConfirmationService } from 'primeng/primeng';
import { ICodeSetInfo } from 'src/app/modules/code-set-editor/models/code-set.models';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/modules/dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-code-set-management',
  templateUrl: './code-set-management.component.html',
  styleUrls: ['./code-set-management.component.css']
})
export class CodeSetManagementComponent implements OnInit {


  filterExposed: boolean = false;
  children: any[];
  filteredChildren: any[];

  @Input()
  info: ICodeSetInfo;
  constructor(private confirmationService: ConfirmationService,     private dialog: MatDialog,
    ) {


    }

    ngOnInit(): void {
      this.filteredChildren = [...this.info.children];
    }
  confirm() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: () => {
            //Actual logic to perform a confirmation
        }
    });
}

  handleChange(event) {
    const message = event.checked
      ? 'Are you sure you want to Expose this code Set '
      : 'Are you sure you want to un Expose this code Set';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: message,
        action: "Expose Confirmation",
      },
    });
    dialogRef.afterClosed().subscribe(
      (answer) => {
        if (answer) {
          this.info.exposed = event.checked;

        }else{
          this.info.exposed = !event.checked;

        }
      },
    );
  }

}
