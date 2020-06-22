import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICDDiagnosis } from 'src/app/models/ICDDiagnosis';
import { HttpResponse } from '@angular/common/http';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { Store } from '@ngrx/store';
import { updateDiagnosisList } from '../store/claim.actions';

@Component({
  selector: 'claim-dignosis',
  templateUrl: './claim-dignosis.component.html',
  styleUrls: ['./claim-dignosis.component.css']
})
export class ClaimDignosisComponent implements OnInit {

  diagnosisController: FormControl = new FormControl();
  diagnosisList: ICDDiagnosis[] = [];
  icedOptions: ICDDiagnosis[] = [];

  constructor(private adminService: AdminService, private store: Store) { }

  ngOnInit() {
  }

  searchICDCodes() {
    this.icedOptions = [];
    if (this.diagnosisController.value != "")
      this.adminService.searchICDCode(this.diagnosisController.value).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            if (event.body instanceof Object)
              Object.keys(event.body).forEach(key => {
                if (this.diagnosisList.findIndex(diagnosis => diagnosis.diagnosisCode == event.body[key]["icddiagnosisCode"]) == -1)
                  this.icedOptions.push(new ICDDiagnosis(null,
                    event.body[key]["icddiagnosisCode"],
                    event.body[key]["description"]
                  ));
              });
          }
        }
      );
  }

  addICDDignosis(diag:ICDDiagnosis) {
    if (this.diagnosisList.length < 14) {
      this.diagnosisList.push(diag);
      this.store.dispatch(updateDiagnosisList({list: this.diagnosisList.map(diag => ({diagnosisCode: diag.diagnosisCode, diagnosisDescription: diag.diagnosisDescription}))}));
      this.icedOptions = [];
    }
  }

  removeDiagnosis(diag:ICDDiagnosis){
    const index = this.diagnosisList.findIndex(diagnosis => diag.diagnosisCode == diagnosis.diagnosisCode);
    if(index != -1){
      this.diagnosisList.splice(index, 1);
      this.store.dispatch(updateDiagnosisList({list: this.diagnosisList.map(diag => ({diagnosisCode: diag.diagnosisCode, diagnosisDescription: diag.diagnosisDescription}))}));
    }
  }
}
