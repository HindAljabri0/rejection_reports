import { NgModule } from '@angular/core';
import { DetailscardComponent } from '../components/reusables/detailscard/detailscard.component';
import { MaterialModule } from './material/material.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    DetailscardComponent
  ],
  imports: [
    MaterialModule,
    CommonModule
  ],
  exports: [
    DetailscardComponent
  ]
})
export class SharedModule { }
