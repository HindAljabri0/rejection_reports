import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { SettingsService } from 'src/app/services/settingsService/settings.service';
import { SharedServices } from 'src/app/services/shared.services';
import { loadProviderMappingValues, setCodeValueManagementError, storeProviderMappingValues } from './configurations.actions';
import { CategorizedCodeValue } from './configurations.reducer';


@Injectable({ providedIn: 'root' })
export class ConfigurationsEffects {

    constructor(
        private actions$: Actions,
        private store: Store,
        private settingsService: SettingsService,
        private sharedServices: SharedServices
    ) { }


    onRequestProviderMappingValues$ = createEffect(() => this.actions$.pipe(
        ofType(loadProviderMappingValues),
        switchMap(() => this.settingsService.getProviderMappingsWithCategories(this.sharedServices.providerId).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => storeProviderMappingValues({ values: this.getCategorizedCodeValuesFromResponse(response) })),
            catchError(error => of({ type: setCodeValueManagementError.type, error: error }))
        ))
    ));


    private getCategorizedCodeValuesFromResponse(response): CategorizedCodeValue {
        if (response instanceof HttpResponse) {
            let values: CategorizedCodeValue = new Map();
            const body = response.body;
            const keys = Object.keys(body);
            const codesToMap = (codes) => {
                let codeResult = new Map();
                const keys = Object.keys(codes);
                keys.forEach(key => codeResult.set(key, { label: codes[key]['label'], values: codes[key]['values'] }));
                return codeResult;
            }
            keys.forEach(key => values.set(key, { label: body[key]['label'], codes: codesToMap(body[key]['codes']) }));
            return values;
        }
        return new Map();
    }
}