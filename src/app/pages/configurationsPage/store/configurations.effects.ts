import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { SettingsService } from 'src/app/services/settingsService/settings.service';
import { SharedServices } from 'src/app/services/shared.services';
import { loadProviderMappingValues, saveChangesOfCodeValueManagement, setCodeValueManagementError, storeProviderMappingValues, storeSaveChangesResponsesOfCodeValueManagement } from './configurations.actions';
import { CategorizedCodeValue, codeValueManagementSelectors } from './configurations.reducer';


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

    onSavingChanges$ = createEffect(() => this.actions$.pipe(
        ofType(saveChangesOfCodeValueManagement),
        withLatestFrom(this.store.select(codeValueManagementSelectors.getModificationsValues)),
        map(data => [data[1].newValues, data[1].toDeleteValues]),
        map(data => forkJoin(
            data.map((requestValues, i) => {
                if (requestValues.length > 0) {
                    return this.settingsService.sendChangingProviderMappingsRequest(this.sharedServices.providerId, requestValues, i == 0 ? 'SAVE' : 'DELETE').pipe(
                        filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
                        map(response => ({ request: i == 0 ? 'SAVE' : 'DELETE', status: 'done' })),
                        catchError(err => of({ request: i == 0 ? 'SAVE' : 'DELETE', status: 'error', error: err }))
                    )
                } else {
                    return of({ request: i == 0 ? 'SAVE' : 'DELETE', status: 'done' });
                }
            })
        )),
        map(requests => requests.subscribe(responses => {
            this.store.dispatch(storeSaveChangesResponsesOfCodeValueManagement({ responses: responses }));
            this.store.dispatch(loadProviderMappingValues());
        })),
        
    ), { dispatch: false });


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