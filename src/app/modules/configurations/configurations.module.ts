import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ConfigurationsComponent } from 'src/app/pages/configurationsPage/configurations.component';
import { ConfigurationsEffects } from 'src/app/pages/configurationsPage/store/configurations.effects';
import { configurationReducer } from 'src/app/pages/configurationsPage/store/configurations.reducer';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';



@NgModule({
  declarations: [
    ConfigurationsComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: ConfigurationsComponent }
    ]),
    StoreModule.forFeature('configurationState', configurationReducer),
    EffectsModule.forFeature([ConfigurationsEffects]),
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
  ],

})
export class ConfigurationsModule { }
