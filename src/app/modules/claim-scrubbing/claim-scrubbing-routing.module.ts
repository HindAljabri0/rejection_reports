import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminUploadsComponent } from './components/admin-uploads/admin-uploads.component';

const routes: Routes = [
    { path: 'admin-uploads', component: AdminUploadsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClaimScrubbingRoutingModule { }
