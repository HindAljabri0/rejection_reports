import { NgModule } from '@angular/core';
import { CommonModule, PercentPipe, DatePipe } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { BupaRejectionReportComponent } from './components/bupa-rejection-report/bupa-rejection-report.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BupaRejectionReportComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MaterialModule,
    FormsModule
  ],
  providers: [PercentPipe, DatePipe]
})
export class ReportsModule { }
