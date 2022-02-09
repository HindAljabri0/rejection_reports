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



@NgModule({
    declarations: [UploadsAssigningComponent, UploadAssigningCardComponent],
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
