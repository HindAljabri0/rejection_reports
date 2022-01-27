import { RouterModule } from '@angular/router';
import { UploadHistoryCardComponent } from './../components/reusables/upload-history-card/upload-history-card.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReusableSearchBarComponent } from './../components/reusables/reusable-search-bar/reusable-search-bar.component';
import { NgModule } from '@angular/core';
import { DetailscardComponent } from '../components/reusables/detailscard/detailscard.component';
import { MaterialModule } from './material/material.module';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from '../components/reusables/empty-state/empty-state.component';
import { ScrollableDirective } from '../directives/scrollable/scrollable.directive';

@NgModule({
  declarations: [
    DetailscardComponent,
    EmptyStateComponent,
    ReusableSearchBarComponent,
    UploadHistoryCardComponent,
    ScrollableDirective
  ],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    DetailscardComponent,
    EmptyStateComponent,
    FormsModule,
    ReactiveFormsModule,
    ReusableSearchBarComponent,
    UploadHistoryCardComponent,
    ScrollableDirective
  ]
})
export class SharedModule { }
