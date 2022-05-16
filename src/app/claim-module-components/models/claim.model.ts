import { ClaimIdentifier } from './claimIdentifier.model';
import { Member } from './member.model';
import { VisitInfo } from './visitInfo.model';
import { GDPN } from './GDPN.model';
import { Invoice } from './invoice.model';
import { Admission } from './admission.model';
import { AttachmentRequest, FileType } from './attachmentRequest.model';
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
    doctorRemarks?: string;
    coderRemarks?: string;

    constructor(claimType: string, providerClaimNumber: string) {
        const type = claimType === 'INPATIENT' ? 'INPATIENT' : 'OUTPATIENT';
        this.caseInformation = new CaseInfo(type);
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

                const claim = new Claim(claimType, providerClaimNumber);
                claim.claimIdentities.payerID = payerId;
                claim.claimIdentities.approvalNumber = approvalNumber;

                claim.member.memberID = memberInfo['memberID'];
                claim.member.idNumber = memberInfo['idNumber'];
                claim.member.policyNumber = memberInfo['policyNumber'];
                claim.member.planType = memberInfo['planType'];

                if (visitInformation['visitDate'] != null) {
                    claim.visitInformation.visitDate = new Date(visitInformation['visitDate']);
                }
                claim.visitInformation.visitType = visitInformation['visitType'];

                const physician = caseInformation['physician'];
                claim.caseInformation.physician.physicianID = physician['physicianID'];
                claim.caseInformation.physician.physicianName = physician['physicianName'];
                claim.caseInformation.physician.physicianCategory = physician['physicianCategory'];

                const patient = caseInformation['patient'];
                claim.caseInformation.patient.fullName = patient['patientName'];
                if (patient['patientName'] == null || patient['patientName'] == '') {
                    claim.caseInformation.patient.fullName = memberInfo['fullName'];
                }
                if (patient['age'] != null) {
                    claim.caseInformation.patient.age = this.getPeriod(patient['age']['value']);
                }
                claim.caseInformation.patient.gender = patient['gender'];
                if (patient['gender'] == null || patient['gender'] == '') {
                    claim.caseInformation.patient.gender = memberInfo['gender'];
                }
                claim.caseInformation.patient.nationality = patient['nationality'];
                claim.caseInformation.patient.patientFileNumber = patient['patientFileNumber'];
                claim.caseInformation.patient.contactNumber = patient['contactNumber'];
                if (memberInfo['dob'] != null) {
                    claim.caseInformation.patient.dob = new Date(memberInfo['dob']);
                }

                const caseDescription = caseInformation['caseDescription'];
                claim.caseInformation.caseDescription.bloodPressure = caseDescription['bloodPressure'];
                claim.caseInformation.caseDescription.temperature = caseDescription['temperature'];
                claim.caseInformation.caseDescription.pulse = caseDescription['pulse'];
                claim.caseInformation.caseDescription.respRate = caseDescription['respRate'];
                claim.caseInformation.caseDescription.weight = caseDescription['weight'];
                claim.caseInformation.caseDescription.height = caseDescription['height'];
                if (caseDescription['lmp'] != null) {
                    claim.caseInformation.caseDescription.lmp = new Date(caseDescription['lmp']);
                }
                claim.caseInformation.caseDescription.illnessCategory = caseDescription['illnessCategory'];
                if (caseDescription['illnessDuration'] != null) {
                    claim.caseInformation.caseDescription.illnessDuration = this.getPeriod(caseDescription['illnessDuration']);
                }
                claim.caseInformation.caseDescription.chiefComplaintSymptoms = caseDescription['chiefComplaintSymptoms'];
                claim.caseInformation.caseDescription.diagnosis = caseDescription['diagnosis'];
                if (claim.caseInformation.caseDescription.diagnosis != null) {
                    claim.caseInformation.caseDescription.diagnosis = claim.caseInformation.caseDescription.diagnosis.map(diagnosis =>
                        ({ ...diagnosis, diagnosisCode: diagnosis.diagnosisCode.trim() }));
                }

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

    public static fromViewResponse(incomingClaim: any): Claim {
        let claim: Claim = { ...incomingClaim };
        const age = incomingClaim.caseInformation.patient.age;
        const illnessDuration = incomingClaim.caseInformation.caseDescription.illnessDuration;
        let fullName = incomingClaim.caseInformation.patient.fullName;
        const firstName = incomingClaim.caseInformation.patient.firstName;
        const middleName = incomingClaim.caseInformation.patient.middleName;
        const lastName = incomingClaim.caseInformation.patient.lastName;

        if (age != null) {
            claim = {
                ...claim, caseInformation: {
                    ...claim.caseInformation,
                    patient: { ...claim.caseInformation.patient, age: this.getPeriod(age) }
                }
            };
        }
        if (illnessDuration != null) {
            claim = {
                ...claim, caseInformation: {
                    ...claim.caseInformation,
                    caseDescription: { ...claim.caseInformation.caseDescription, illnessDuration: this.getPeriod(illnessDuration) }
                }
            };
        }
        if (fullName == null || fullName.trim().length == 0) {
            if (firstName != null) {
                fullName = firstName;
                if (middleName != null) { fullName += ` ${middleName}`; }
                if (lastName != null) { fullName += ` ${lastName}`; }
            }
        }
        const attachments = claim.attachment.map(att => ({ ...att, fileType: Claim.convertFileType(att.fileType) }));
        const physicianCategory = claim.caseInformation.physician.physicianCategory;
        claim = {
            ...claim,
            attachment: attachments,
            caseInformation: {
                ...claim.caseInformation,
                physician: { ...claim.caseInformation.physician, physicianCategory },
                patient: { ...claim.caseInformation.patient, fullName, firstName: null, middleName: null, lastName: null }
            }
        };
        const admission = incomingClaim.admission;
        if (admission != null) {
            if (admission.estimatedLengthOfStay != null) {
                claim = {
                    ...claim, admission: {
                        ...claim.admission,
                        discharge: {
                            ...claim.admission.discharge,
                            actualLengthOfStay: this.getPeriod(admission.estimatedLengthOfStay)
                        }
                    }
                };
            } else if (admission.discharge != null && admission.discharge.actualLengthOfStay != null) {
                claim = {
                    ...claim, admission: {
                        ...claim.admission,
                        discharge: {
                            ...claim.admission.discharge,
                            actualLengthOfStay: this.getPeriod(admission.discharge.actualLengthOfStay)
                        }
                    }
                };
            }
        }
        return claim;
    }

    private static convertFileType(incomingFileType: string): FileType {
        switch (incomingFileType) {
            case 'MEDICAL_REPORT':
                return 'Medical Report';
            case 'IQAMA_ID_COPY':
                return 'Iqama/ID copy';
            case 'X_RAY_RESULT':
                return 'X-Ray result';
            case 'LAB_RESULT':
                return 'Lab Result';
        }
    }

    private static getPeriod(duration: string): Period {
        if (duration.startsWith('P')) {
            if (duration.indexOf('Y', 1) != -1) {
                const value = Number.parseInt(duration.replace('P', '').replace('Y', ''), 10);
                if (Number.isInteger(value)) {
                    return new Period(value, 'years');
                }
            } else if (duration.indexOf('M', 1) != -1) {
                const value = Number.parseInt(duration.replace('P', '').replace('M', ''), 10);
                if (Number.isInteger(value)) {
                    return new Period(value, 'months');
                }
            } else if (duration.indexOf('D', 1) != -1) {
                const value = Number.parseInt(duration.replace('P', '').replace('D', ''), 10);
                if (Number.isInteger(value)) {
                    return new Period(value, 'days');
                }
            }
        }
        return null;
    }
}
