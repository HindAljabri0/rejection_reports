import { Observation } from './observation.model';

export class Investigation {
    investigationType: string;
    investigationCode: string;
    investigationDescription: string;
    investigationDate: Date;
    observation: Observation[];
    investigationComments: string;

}
