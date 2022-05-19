import { PageEvent } from "@angular/material";
import { createAction, props } from "@ngrx/store";
import { Claim } from "src/app/claim-module-components/models/claim.model";
import { UploadsPage } from "../models/claimReviewState.model";
import { DiagnosisRemarksUpdateRequest, FieldError, MarkAsDone,  } from "./claimReview.reducer";


export const uploadsReviewPageAction = createAction("[ Claims Review ] page changing action in uploads page", props<PageEvent>());
export const uploadsReviewTabAction = createAction("[ Claims Review ] on tab changed action in uploads page", props<{ index: number }>());
export const loadUploadsUnderReviewOfSelectedTab = createAction("[ Claims Review ] load uploads of the selected tab from backend");
export const setUploadsPageOfSelectedTab = createAction("[ Claims Review ] update the state with the incoming uploads after calling backend", props<UploadsPage>())
export const setUploadsPageErrorOfSelectedTab = createAction("[ Claims Review ] set error of selected tab page", props<{ message: string }>());
export const loadSingleClaim = createAction("[ Claims Review ] load single claim", props<{ data: {uploadId: number, provClaimNo: string} }>());
export const setSingleClaim = createAction("[ Claims Review ] set single claim", props<Claim>());
export const loadSingleClaimErrors = createAction("[ Claims Review ] load claim errors", props<{ data: {uploadId: number, provClaimNo: string} }>());
export const setSingleClaimErrors = createAction("[ Claims Review ] set claim errors", props<{errors: FieldError[]}>());

export const setDiagnnosisRemarks = createAction("[ Claims Review ] set diagnosis remarks", props<{data: DiagnosisRemarksUpdateRequest}>());
export const setClaimDetailsRemarks = createAction("[ Claims Review ] set claim details remarks", props<{data: DiagnosisRemarksUpdateRequest}>());
export const markAsDone = createAction("[ Claims Review ] mark claim as done", props<{data: MarkAsDone}>());
