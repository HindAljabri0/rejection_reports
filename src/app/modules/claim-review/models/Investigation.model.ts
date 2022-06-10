import { Investigation } from "src/app/claim-module-components/models/investigation.model";
import { ClaimViewObservation } from "./ClaimViewObservation.model";

export class ClaimViewInvestigation {
    investigationId?: number; 
    investigationType: string; 
    investigationCode: string;
    investigationDescription: string; 
    investigationDate: Date; 
    observations: ClaimViewObservation[]
    isOpen: boolean; 

    static map(investigations: Investigation []): ClaimViewInvestigation[] {
      let invResult: ClaimViewInvestigation[] = investigations.map(investigation => {
      let newInvestigation: ClaimViewInvestigation = {
        investigationId: investigation.investigationId,
        investigationCode: investigation.investigationCode,
        investigationDate: investigation.investigationDate,
        investigationDescription: investigation.investigationDescription,
        investigationType: investigation.investigationType,
        isOpen: false,
        observations: investigation.observation.map(observation =>{
          let newObservation: ClaimViewObservation = {
            observationCode: observation.observationCode,
            isOpen: false,
            observationId: observation.observationId,
            observationValue: observation.observationValue,
            observationComment: observation.observationComment,
            observationDescription: observation.observationDescription,
            observationUnit: observation.observationUnit,
          }  
          return newObservation
        })
      }
      return newInvestigation
    })
    return invResult;
    }
};

