import { GDPN } from './GDPN.model';
import { Service } from 'src/app/models/service';

export class Invoice {

    invoiceNumber:string;
	invoiceDate:Date;
	invoiceDepartment:string;
	invoiceGDPN:GDPN;
	service:Service[];
	
	constructor(){
		this.service = [];
		this.service.push(new Service())
	}
    
}