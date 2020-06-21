import { Period } from './period.type';
import { Diagnosis } from './diagnosis.model';
import { Optics } from './optics.model';
import { Investigation } from './investigation.model';

export class CaseDescription {

    bloodPressure:string;
	temperature:number;
	pulse:number;
	respRate:number;
	weight:number;
	height:number;
	lmp:Date;
	illnessCategory: {inllnessCode:string[]};
	illnessDuration: Period;
	diagnosis:Diagnosis[] = [];
	optics:Optics;
	investigation:Investigation[] = [];
	chiefComplaintSymptoms:string;
    signicantSigns:string;
    
}