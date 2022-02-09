import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadsAssigningComponent } from './components/uploads-assigning/uploads-assigning.component';
import { ClaimReviewRoutingModule } from './claim-review-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';



@NgModule({
    declarations: [UploadsAssigningComponent],
    imports: [
        CommonModule,
        SharedModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        ClaimReviewRoutingModule,
        NgScrollbarModule,
        SmoothScrollModule
    ]
})
export class ClaimReviewModule { }
