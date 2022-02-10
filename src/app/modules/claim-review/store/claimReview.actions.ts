import { MatTabChangeEvent, PageEvent } from "@angular/material";
import { createAction, props } from "@ngrx/store";
import { UploadsPage } from "../models/claimReviewState.model";
import { Upload } from "../models/upload.model";


export const uploadsReviewPageAction = createAction("[ Claims Review ] page changing action in uploads page", props<PageEvent>());
export const uploadsReviewTabAction = createAction("[ Claims Review ] on tab changed action in uploads page", props<{ index: number }>());
export const loadUploadsUnderReviewOfSelectedTab = createAction("[ Claims Review ] load uploads of the selected tab from backend");
export const setUploadsPageOfSelectedTab = createAction("[ Claims Review ] update the state with the incoming uploads after calling backend", props<UploadsPage>())
export const setUploadsPageErrorOfSelectedTab = createAction("[ Claims Review ] set error of selected tab page", props<{ message: string }>());