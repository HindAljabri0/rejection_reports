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
import { RejectionCardData } from '../components/rejection-card/rejectionCardData';


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
                    let values = data.data;
                    if (values["statuses"] != undefined) {
                        this.searchService.getSummaries(this.sharedServices.providerId, values["statuses"], criteria.fromDate, criteria.toDate, `${criteria.payerId}`)
                            .subscribe(event => {
                                if (event instanceof HttpResponse) {
                                    this.store.dispatch(setCardSummary({ name: name, data: new SearchStatusSummary(event.body) }));
                                    this.store.dispatch(setCardIsLoading({ name: name, loading: false }));
                                }
                            }, errorEvent => {
                                if (errorEvent instanceof HttpErrorResponse) {
                                    this.store.dispatch(setCardError({ name: name, error: errorEvent.message }));
                                }
                                this.store.dispatch(setCardIsLoading({ name: name, loading: false }));
                            });
                    } else {
                        if (values["rejectionBy"] != 'Service' || (values["rejectionBy"] == 'Service' && criteria.payerId == 102)) {
                            this.searchService.getTopFiveRejections(values["rejectionBy"], this.sharedServices.providerId, `${criteria.payerId}`, criteria.fromDate, criteria.toDate,)
                                .subscribe(event => {
                                    if (event instanceof HttpResponse) {
                                        this.store.dispatch(setCardSummary({ name: name, data: new RejectionCardData(values["rejectionBy"], event.body) }));
                                        this.store.dispatch(setCardIsLoading({ name: name, loading: false }));
                                    }
                                }, errorEvent => {
                                    if (errorEvent instanceof HttpErrorResponse) {
                                        this.store.dispatch(setCardError({ name: name, error: errorEvent.message }));
                                    }
                                    this.store.dispatch(setCardIsLoading({ name: name, loading: false }));
                                });
                        } else {
                            this.store.dispatch(setCardError({name: name, error: `Payer's Data Not Available.`}));
                            this.store.dispatch(setCardIsLoading({ name: name, loading: false }));
                        }
                    }
                }).unsubscribe();
            });
        })
    ), { dispatch: false });

}