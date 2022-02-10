import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUploadsComponent } from './components/admin-uploads/admin-uploads.component';
import { ClaimScrubbingRoutingModule } from './claim-scrubbing-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';



@NgModule({
    declarations: [AdminUploadsComponent],
    imports: [
        CommonModule,
        SharedModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        ClaimScrubbingRoutingModule,
        NgScrollbarModule,
        SmoothScrollModule
    ]
})
export class ClaimScrubbingModule { }
