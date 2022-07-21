import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimReviewUploadComponent } from './components/claim-review-upload/claim-review-upload.component';
import { DoctorUploadsClaimListComponent } from './components/doctor-uploads-claim-list/doctor-uploads-claim-list.component';
import { DoctorUploadsComponent } from './components/doctor-uploads/doctor-uploads.component';
import { UploadsAssigningComponent } from './components/uploads-assigning/uploads-assigning.component';

const routes: Routes = [
    { path: 'scrubbing/upload', component: DoctorUploadsComponent },
    { path: 'scrubbing/upload/:uploadId/claim', component: DoctorUploadsClaimListComponent },
    { path: 'scrubbing/admin', component: UploadsAssigningComponent },
    { path: 'scrubbing/admin/upload-claim', component: ClaimReviewUploadComponent },
    // { path: 'scrubbing/upload/:uploadId/claim/:provClaimNo', component: DoctorUploadsClaimListComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClaimReviewRoutingModule { }
