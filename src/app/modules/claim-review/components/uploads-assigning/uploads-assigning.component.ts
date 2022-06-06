import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material';
import { Store } from '@ngrx/store';
import { filter } from 'jszip';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SharedServices } from 'src/app/services/shared.services';
import { UploadsPage } from '../../models/claimReviewState.model';
import { SwitchUser } from '../../models/SwitchUser.model';
import { loadCoderList, loadDoctorList, loadProviderList, loadUploadsUnderReviewOfSelectedTab, setDoctorAndCoderData, uploadsReviewTabAction } from '../../store/claimReview.actions';
import { completedClaimsUnderReviewPage, getCoderId, getCoderList, getDoctorId, getDoctorList, getProviderList, inProgressClaimsUnderReviewPage, newClaimsUnderReviewPage } from '../../store/claimReview.reducer';

@Component({
    selector: 'app-uploads-assigning',
    templateUrl: './uploads-assigning.component.html',
    styles: []
})
export class UploadsAssigningComponent implements OnInit {

    newUploads$: Observable<UploadsPage>;
    inProgressUploads$: Observable<UploadsPage>;
    completedUploads$: Observable<UploadsPage>;
    doctorList$: Observable<SwitchUser[]>;
    coderList$: Observable<SwitchUser[]>;
    selectedDoctor: string;
    selectedCoder: string;
    providerList$: Observable<any>;
    providerController: FormControl = new FormControl();
    selectedProvider: string;
    errors: string;
    filteredProviders: any[] = [];

    constructor(private store: Store, private sharedServices: SharedServices) { }

    ngOnInit() {
        this.newUploads$ = this.store.select(newClaimsUnderReviewPage);
        this.inProgressUploads$ = this.store.select(inProgressClaimsUnderReviewPage);
        this.completedUploads$ = this.store.select(completedClaimsUnderReviewPage);
        this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
        this.store.dispatch(loadDoctorList());
        this.store.dispatch(loadCoderList());
        this.store.dispatch(loadProviderList());
        this.doctorList$ = this.store.select(getDoctorList);
        this.coderList$ = this.store.select(getCoderList);
        this.providerList$ = this.store.select(getProviderList);
    }

    dispatchTabChangeEvent(event: MatTabChangeEvent) {
        this.store.dispatch(uploadsReviewTabAction({ index: event.index }));
        this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
    }

    onDoctorSelectionChanged(data: string) {
        this.selectedDoctor = data
    }

    onCoderSelectionChanged(data: string) {
        this.selectedCoder = data;
    }

    filterData() {
        console.log("Inside FilterData");

        if (this.selectedCoder === '-1') {
            this.selectedCoder = '';
        }
        if (this.selectedDoctor === '-1') {
            this.selectedDoctor = '';
        }
        this.selectProvider();
        this.store.dispatch(setDoctorAndCoderData({ selectedDoctorId: this.selectedDoctor, selectedCoderId: this.selectedCoder, selectedProvider:this.selectedProvider }));
        this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
    }

    selectProvider(providerId: string = null) {
        if (providerId !== null)
            this.selectedProvider = providerId;
        else {
            if(this.providerController.value != null && this.providerController.value != '')
            {
                const providerId = this.providerController.value.split('|')[0].trim();
                this.selectedProvider = providerId;
            }
        }
    }

    updateFilter() {
        // Pending Code
    }
}
