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
import { NphiesPayersSelectorComponent } from '../components/reusables/nphies-payers-selector/nphies-payers-selector.component';
import { ManageSupportingInfoComponent } from './nphies/add-preauthorization/manage-supporting-info/manage-supporting-info.component';

@NgModule({
  declarations: [
    DetailscardComponent,
    EmptyStateComponent,
    ReusableSearchBarComponent,
    UploadHistoryCardComponent,
    ScrollableDirective,
    NphiesPayersSelectorComponent,
    ManageSupportingInfoComponent
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
    ScrollableDirective,
    NphiesPayersSelectorComponent,
    ManageSupportingInfoComponent
  ]
})
export class SharedModule { }
