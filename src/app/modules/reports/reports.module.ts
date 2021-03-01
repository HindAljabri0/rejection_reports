import { NgModule } from '@angular/core';
import { CommonModule, PercentPipe, DatePipe } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { BupaRejectionReportComponent } from './components/bupa-rejection-report/bupa-rejection-report.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { CleanClaimProgressReportComponent } from './components/clean-claim-progress-report/clean-claim-progress-report.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [BupaRejectionReportComponent, CleanClaimProgressReportComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReportsRoutingModule,
    MaterialModule,
    FormsModule,
    BsDatepickerModule,
    ChartsModule
  ],
  providers: [PercentPipe, DatePipe]
})
export class ReportsModule { }
