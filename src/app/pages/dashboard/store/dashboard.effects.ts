import { AdminService } from './../../../services/adminService/admin.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchService } from 'src/app/services/serchService/search.service';
import {
    updateSearchCriteria,
    dashboardCardNames,
    setCardIsLoading,
    setCardSummary,
    setCardError,
    getDepartmentNames,
    setDepartmentNames
} from './dashboard.actions';
import { tap, switchMap, filter, map, catchError } from 'rxjs/operators';
import { getSummaryByName } from './dashboard.reducer';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';
import { RejectionCardData } from '../components/rejection-card/rejectionCardData';
import { of } from 'rxjs/internal/observable/of';
import { ClaimsSummary } from 'src/app/models/ClaimsSummary';


@Injectable({
    providedIn: 'root'
})
export class DashboardEffects {

    constructor(
        private store: Store,
        private actions$: Actions,
        private searchService: SearchService,
        private sharedServices: SharedServices,
        private adminService: AdminService
    ) { }
    getDapertmentName = createEffect(() => this.actions$.pipe(
        ofType(getDepartmentNames),
        switchMap(() => this.adminService.getLOVsForClaimCreation().pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => setDepartmentNames(response)),
            catchError(err => of({ type: setDepartmentNames.type }))
        ))
    ));

    loadSummaries$ = createEffect(() => this.actions$.pipe(
        ofType(updateSearchCriteria),
        tap(criteria => {
            dashboardCardNames.forEach(name => {
                this.store.dispatch(setCardIsLoading({ name: name, loading: true }));
                this.store.select(getSummaryByName(name)).subscribe(data => {
                    const values = data.data;
                   
                    if (values['statuses'] != undefined) {
                        this.searchService.getClaimsSummary(this.sharedServices.providerId,`${criteria.payerId}`,
                           criteria.fromDate, criteria.toDate, values['statuses'])
                            .subscribe(event => {
                                if (event instanceof HttpResponse) {
                                    this.store.dispatch(setCardSummary({ name: name, data: new ClaimsSummary(event.body,values['statuses']) }));
                                    this.store.dispatch(setCardIsLoading({ name: name, loading: false }));
                                }
                            }, errorEvent => {
                                if (errorEvent instanceof HttpErrorResponse) {
                                
                                   
                                  
                        
                                     if(errorEvent.status ==404){
                                        this.store.dispatch(setCardSummary({ name: name, data: ClaimsSummary.emptySummaryWithStatuses(values['statuses']) }));
                                        this.store.dispatch(setCardIsLoading({ name: name, loading: false }));
                                     }
                                   else{
                                   
                                  
                                    this.store.dispatch(setCardError({ name: name, error:errorEvent.error })); 
                                }
                                }
                                this.store.dispatch(setCardIsLoading({ name: name, loading: false }));
                            });
                    } else {
                        if (values['rejectionBy'] != 'Service' || (values['rejectionBy'] == 'Service' && criteria.payerId == 102)) {
                            this.searchService.getTopFiveRejections(values['rejectionBy'],
                                this.sharedServices.providerId, `${criteria.payerId}`, criteria.fromDate, criteria.toDate)
                                .subscribe(event => {
                                    if (event instanceof HttpResponse) {
                                        this.store.dispatch(setCardSummary({
                                            name: name,
                                            data: new RejectionCardData(values['rejectionBy'], event.body)
                                        }));
                                        this.store.dispatch(setCardIsLoading({ name: name, loading: false }));
                                    }
                                }, errorEvent => {
                                    if (errorEvent instanceof HttpErrorResponse) {
                                        this.store.dispatch(setCardError({ name: name, error: errorEvent.message }));
                                    }
                                    this.store.dispatch(setCardIsLoading({ name: name, loading: false }));
                                });
                        } else {
                            this.store.dispatch(setCardError({ name: name, error: `Payer's Data Not Available.` }));
                            this.store.dispatch(setCardIsLoading({ name: name, loading: false }));
                        }
                    }
                }).unsubscribe();
            });
        })
    ), { dispatch: false });

}
