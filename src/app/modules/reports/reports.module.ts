import { NgModule } from '@angular/core';
import { CommonModule, PercentPipe } from '@angular/common';

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
  providers: [PercentPipe]
})
export class ReportsModule { }
