import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadsAssigningComponent } from './components/uploads-assigning/uploads-assigning.component';
import { ClaimReviewRoutingModule } from './claim-review-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';
import { UploadAssigningCardComponent } from './components/upload-assigning-card/upload-assigning-card.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { claimReviewReducer } from './store/claimReview.reducer';
import { ClaimReviewEffects } from './store/claimReview.effects';
import { UploadsAssigningTabContentComponent } from './components/uploads-assigning-tab-content/uploads-assigning-tab-content.component';
import { DoctorUploadsComponent } from './components/doctor-uploads/doctor-uploads.component';
import { DoctorUploadsClaimListComponent } from './components/doctor-uploads-claim-list/doctor-uploads-claim-list.component';
import {
    DoctorUploadsClaimDetailsDialogComponent
} from './components/doctor-uploads-claim-details-dialog/doctor-uploads-claim-details-dialog.component';



@NgModule({
    declarations: [
        UploadsAssigningComponent,
        UploadAssigningCardComponent,
        UploadsAssigningTabContentComponent,
        DoctorUploadsComponent,
        DoctorUploadsClaimListComponent,
        DoctorUploadsClaimDetailsDialogComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        ClaimReviewRoutingModule,
        NgScrollbarModule,
        SmoothScrollModule,
        StoreModule.forFeature('claimReviewState', claimReviewReducer),
        EffectsModule.forFeature([ClaimReviewEffects]),
    ]
})
export class ClaimReviewModule { }
