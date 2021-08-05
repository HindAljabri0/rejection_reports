import { Observation } from './observation.model';

export class Investigation {
    investigationId?: number;
    investigationType: string;
    investigationCode: string;
    investigationDescription: string;
    investigationDate: Date;
    observation: Observation[];
    investigationComments: string;

}
