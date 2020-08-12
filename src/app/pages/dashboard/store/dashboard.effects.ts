import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchService } from 'src/app/services/serchService/search.service';
import { updateSearchCriteria, dashboardCardNames, setCardIsLoading, setCardSummary, setCardError } from './dashboard.actions';
import { tap } from 'rxjs/operators';
import { getSummaryByName } from './dashboard.reducer';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';


@Injectable({
    providedIn: 'root'
})
export class DashboardEffects {

    constructor(
        private store: Store,
        private actions$: Actions,
        private searchService: SearchService,
        private sharedServices: SharedServices
    ) { }

    loadSummaries$ = createEffect(() => this.actions$.pipe(
        ofType(updateSearchCriteria),
        tap(criteria => {
            dashboardCardNames.forEach(name => {
                this.store.dispatch(setCardIsLoading({ name: name, loading: true }));
                this.store.select(getSummaryByName(name)).subscribe(data => {
                    this.searchService.getSummaries(this.sharedServices.providerId, data.summary.statuses, criteria.fromDate, criteria.toDate, `${criteria.payerId}`)
                        .subscribe(event => {
                            if (event instanceof HttpResponse) {
                                this.store.dispatch(setCardSummary({ name: name, summary: new SearchStatusSummary(event.body) }));
                                this.store.dispatch(setCardIsLoading({ name: name, loading: false }));
                            }
                        }, errorEvent => {
                            if(errorEvent instanceof HttpErrorResponse){
                                this.store.dispatch(setCardError({name: name, error: errorEvent.message}));
                            }
                            this.store.dispatch(setCardIsLoading({ name: name, loading: false }));
                        });
                }).unsubscribe();
            });
        })
    ), {dispatch: false});

}