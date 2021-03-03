import { GDPN } from './GDPN.model';
import { Service } from './service.model';

export class Invoice {
  invoiceNumber: string;
  invoiceDate: Date;
  invoiceDepartment: string;
  invoiceGDPN: GDPN = new GDPN();
  service: Service[];

  constructor() {
    this.service = [];
    this.service.push(new Service());
  }

}
