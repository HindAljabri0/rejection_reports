import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { loadLOVs, setLOVs, setError } from './claim.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { of } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ClaimEffects {

    constructor(private actions$: Actions, private adminService:AdminService){}

    loadLOVs$ = createEffect(() => this.actions$.pipe(
        ofType(loadLOVs),
        switchMap(() => this.adminService.getLOVsForClaimCreation().pipe(
            map(response => setLOVs({LOVs:response})),
            catchError(err => of({type: setError.type, error: err}))
        ))
    ));

}