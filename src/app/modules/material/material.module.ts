import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule,
  MatButtonModule,
  MatGridListModule,
  MatDividerModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatRippleModule,
  MatToolbarModule,
  MatMenuModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatInputModule,
  MatIconModule,
  MatSelectModule,
  MatRadioModule,
  MatChipsModule,
  MatProgressBarModule,
  MatPaginatorModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatAutocompleteModule,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  MatTabsModule,
 
} from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';

// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DD/MM/YYYY ',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'DD/MM/YYYY',
  },
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRippleModule,
    MatToolbarModule,
    MatMenuModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatChipsModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    DragDropModule,
    OverlayModule,
    MatSnackBarModule,
    MatTabsModule,
    NgxMatSelectSearchModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class MaterialModule { }
