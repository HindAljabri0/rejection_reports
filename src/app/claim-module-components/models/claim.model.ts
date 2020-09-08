import { ClaimIdentifier } from './claimIdentifier.model';
import { Member } from './member.model';
import { VisitInfo } from './visitInfo.model';
import { GDPN } from './GDPN.model';
import { Invoice } from './invoice.model';
import { Admission } from './admission.model';
import { AttachmentRequest } from './attachmentRequest.model';
import { CaseInfo } from './caseInfo.model';
import { HttpResponse } from '@angular/common/http';
import { Period } from './period.type';

export class Claim {

    claimIdentities: ClaimIdentifier;
    member: Member;
    visitInformation: VisitInfo;
    caseInformation: CaseInfo;
    claimGDPN: GDPN;
    invoice: Invoice[];
    commreport: string;
    admission: Admission;
    attachment: AttachmentRequest[];

    constructor(claimType: string, providerClaimNumber: string) {
        this.caseInformation = new CaseInfo('OUTPATIENT');
        this.claimIdentities = new ClaimIdentifier(providerClaimNumber);
        this.member = new Member();
        this.visitInformation = new VisitInfo(claimType);
        this.claimGDPN = new GDPN();
        this.invoice = [new Invoice()];
        this.admission = new Admission();
        this.attachment = [];
    }

    static fromApprovalResponse(claimType: string, providerClaimNumber: string, payerId: string, approvalNumber: string, response): Claim {
        try {
            if (response instanceof HttpResponse) {
                const body = response.body;
                const memberInfo = body['memberInfo'];
                const coverageInfo = body['coverageInfo'];
                const visitInformation = body['visitInformation'];
                const caseInformation = body['caseInformation'];
                const status = body['status'];
                const validityEffect = body['validityEffect'];
                const editing = body['editing'];
                const admissionResponse = body['admissionResponse'];
                
                const comment = body['comment'];
                const estimatedCost = body['estimatedCost'];
                const approvedCost = body['approvedCost'];

                let claim = new Claim(claimType, providerClaimNumber);
                claim.claimIdentities.payerID = payerId;
                claim.claimIdentities.approvalNumber = approvalNumber;

                claim.member.memberID = memberInfo['memberID'];
                claim.member.idNumber = memberInfo['idNumber'];
                claim.member.policyNumber = memberInfo['policyNumber'];
                claim.member.planType = memberInfo['planType'];

                if (visitInformation['visitDate'] != null)
                    claim.visitInformation.visitDate = new Date(visitInformation['visitDate']);
                claim.visitInformation.visitType = visitInformation['visitType'];

                const physician = caseInformation['physician'];
                claim.caseInformation.physician.physicianID = physician['physicianID'];
                claim.caseInformation.physician.physicianName = physician['physicianName'];
                claim.caseInformation.physician.physicianCategory = physician['physicianCategory'];

                const patient = caseInformation['patient'];
                claim.caseInformation.patient.fullName = patient['patientName'];
                if (patient['age'] != null)
                    claim.caseInformation.patient.age = this.getPeriod(patient['age']['value']);
                claim.caseInformation.patient.gender = patient['gender'];
                claim.caseInformation.patient.nationality = patient['nationality'];
                claim.caseInformation.patient.patientFileNumber = patient['patientFileNumber'];
                claim.caseInformation.patient.contactNumber = patient['contactNumber'];
                if (memberInfo['dob'] != null)
                    claim.caseInformation.patient.dob = new Date(memberInfo['dob']);

                const caseDescription = caseInformation['caseDescription'];
                claim.caseInformation.caseDescription.bloodPressure = caseDescription['bloodPressure'];
                claim.caseInformation.caseDescription.temperature = caseDescription['temperature'];
                claim.caseInformation.caseDescription.pulse = caseDescription['pulse'];
                claim.caseInformation.caseDescription.respRate = caseDescription['respRate'];
                claim.caseInformation.caseDescription.weight = caseDescription['weight'];
                claim.caseInformation.caseDescription.height = caseDescription['height'];
                if (caseDescription['lmp'] != null)
                    claim.caseInformation.caseDescription.lmp = new Date(caseDescription['lmp']);
                claim.caseInformation.caseDescription.illnessCategory = caseDescription['illnessCategory'];
                if (caseDescription['illnessDuration'] != null)
                    claim.caseInformation.caseDescription.illnessDuration = this.getPeriod(caseDescription['illnessDuration']);
                claim.caseInformation.caseDescription.chiefComplaintSymptoms = caseDescription['chiefComplaintSymptoms'];
                claim.caseInformation.caseDescription.diagnosis = caseDescription['diagnosis'];

                claim.caseInformation.possibleLineOfTreatment = caseInformation['possibleLineOfTreatment'];
                claim.caseInformation.radiologyReport = caseInformation['radiologyReport'];
                claim.caseInformation.otherConditions = caseInformation['otherConditions'];

                

                return claim;
            }
        } catch (err) {
            console.log(err);
        }
        throw new Error('Could not read response');
    }

    private static getPeriod(duration: string): Period {
        if (duration.startsWith('P')) {
            if (duration.indexOf('Y', 1) != -1) {
                const value = Number.parseInt(duration.replace('P', '').replace('Y', ''));
                if (Number.isInteger(value))
                    return new Period(value, 'years');
            } else if (duration.indexOf('M', 1) != -1) {
                const value = Number.parseInt(duration.replace('P', '').replace('M', ''));
                if (Number.isInteger(value))
                    return new Period(value, 'months');
            } else if (duration.indexOf('D', 1) != -1) {
                const value = Number.parseInt(duration.replace('P', '').replace('D', ''));
                if (Number.isInteger(value))
                    return new Period(value, 'days');
            }
        }
        return null;
    }
}