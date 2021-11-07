import { NgModule } from '@angular/core';
import { DetailscardComponent } from '../components/reusables/detailscard/detailscard.component';
import { MaterialModule } from './material/material.module';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from '../components/reusables/empty-state/empty-state.component';


@NgModule({
  declarations: [
    DetailscardComponent,
    EmptyStateComponent,
    
  ],
  imports: [
    MaterialModule,
    CommonModule
  ],
  exports: [
    DetailscardComponent,
    EmptyStateComponent
  ]
})
export class SharedModule { }
