import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadsAssigningComponent } from './components/uploads-assigning/uploads-assigning.component';

const routes: Routes = [
    { path: 'uploads', component: UploadsAssigningComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClaimReviewRoutingModule { }
