import { NgModule } from '@angular/core';
import { DetailscardComponent } from '../components/reusables/detailscard/detailscard.component';
import { MatiralModule } from './matiral/matiral.module';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
      DetailscardComponent
  ],
  imports: [
    MatiralModule,
    CommonModule,
  ],
  exports: [
      DetailscardComponent
  ]
})
export class SharedModule { }