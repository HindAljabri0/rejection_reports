import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationsComponent } from 'src/app/pages/configurationsPage/configurations.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { configurationReducer } from 'src/app/pages/configurationsPage/store/configurations.reducer';
import { ConfigurationsEffects } from 'src/app/pages/configurationsPage/store/configurations.effects';
import { ConfiguartionModalComponent } from 'src/app/pages/configurationsPage/configuartion-modal/configuartion-modal.component';



@NgModule({
  declarations: [
    ConfigurationsComponent,
    ConfiguartionModalComponent
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
  entryComponents: [ConfiguartionModalComponent]
})
export class ConfigurationsModule { }
