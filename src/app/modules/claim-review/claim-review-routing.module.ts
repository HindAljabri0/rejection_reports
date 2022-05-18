import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorUploadsClaimListComponent } from './components/doctor-uploads-claim-list/doctor-uploads-claim-list.component';
import { DoctorUploadsComponent } from './components/doctor-uploads/doctor-uploads.component';

const routes: Routes = [
    { path: 'scrubbing/upload', component: DoctorUploadsComponent },
    { path: 'scrubbing/upload/:uploadId/claim', component: DoctorUploadsClaimListComponent },
    // { path: 'scrubbing/upload/:uploadId/claim/:provClaimNo', component: DoctorUploadsClaimListComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClaimReviewRoutingModule { }
