import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoctorUploadsClaimListComponent } from './components/doctor-uploads-claim-list/doctor-uploads-claim-list.component';
import { DoctorUploadsComponent } from './components/doctor-uploads/doctor-uploads.component';
import { UploadsAssigningComponent } from './components/uploads-assigning/uploads-assigning.component';

const routes: Routes = [
    { path: 'uploads', component: UploadsAssigningComponent },
    { path: 'doctor/uploads', component: DoctorUploadsComponent },
    { path: 'doctor/claims', component: DoctorUploadsClaimListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClaimReviewRoutingModule { }
