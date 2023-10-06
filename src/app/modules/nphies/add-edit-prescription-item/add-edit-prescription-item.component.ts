import { Component, EventEmitter, Output, OnInit, Inject  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSelectChange } from '@angular/material/select';


@Component({
  selector: 'app-add-edit-prescription-item',
  templateUrl: './add-edit-prescription-item.component.html',
  styles: []
})
export class AddEditPrescriptionItemComponent implements OnInit {
  selectedRoute = new FormControl();
  routes = [
    'Buccal',
    'Conjunctival',
    'Cutaneous',
    'Dental',
    'Endocervical',
    'Endosinusial',
    'Endotracheal',
    'Enteral',
    'Epidural',
    'Extra-amniotic',
    'Hemodialysis',
    'Infiltration',
    'Interstitial',
    'Intra-abdominal',
    'Intra-amniotic',
    'Intra-arterial',
    'Intra-articular',
    'Intrabiliary',
    'Intrabronchial',
    'Intrabursal',
    'Intracardiac',
    'Intracartilaginous',
    'Intracorneal',
    'Intracoronary',
    'Intracorporus cavernosum',
    'Intradermal',
    'Intradiscal',
    'Intraductal',
    'Intraduodenal',
    'Intradural',
    'Intraepidermal',
    'Intraesophageal',
    'Intragastric',
    'Intragingival',
    'Intraileal',
    'Intralesional',
    'Intraluminal',
    'Intralymphatic',
    'Intramedullary',
    'Intrameningeal',
    'Intramuscular',
    'Intraocular',
    'Intraovarian',
    'Intrapericardial',
    'Intraperitoneal',
    'Intrapleural',
    'Intraprostatic',
    'Intrapulmonary',
    'Intrasinal',
    'Intraspinal',
    'Intrasynovial',
    'Intratendinous',
    'Intratesticular',
    'Intrathecal',
    'Intrathoracic',
    'Intratubular',
    'Intratumor',
    'Intratympanic',
    'Intrauterine',
    'Intravascular',
    'Intravenous',
    'Intravenous bolus',
    'Intravenous drip',
    'Intraventricular',
    'Intravesical',
    'Intravitreal',
    'Iontophoresis',
    'Irrigation',
    'Laryngeal',
    'Nasal',
    'Nasogastric',
    'Occlusive dressing technique',
    'Ophthalmic',
    'Oral',
    'Oropharyngeal',
    'Otic (auricular)',
    'Percutaneous',
    'Periarticular',
    'Peridural',
    'Perineural',
    'Periodontal',
    'Rectal',
    'Respiratory (inhalation)',
    'Retrobulbar',
    'Soft tissue',
    'Subarachnoid',
    'Subconjunctival',
    'Subcutaneous',
    'Sublingual',
    'Topical',
    'Transdermal',
    'Transmucosal',
    'Transplacental',
    'Transtracheal',
    'Ureteral',
    'Urethral',
    'Vaginal',
    'Not applicable',
    'Unassigned',
    'Unknown'
  ];
  filteredRoutes: string[] = [];
  isAddItemVisible: boolean = false;
  isAddItemDetailsVisible: boolean = false;
  isAddDosageTimingVisible: boolean = false;
  selectedOption: string = '';
  selectedDoseType: string = 'Dose Quantity'; 
  selectedRateType: string = 'Rate Quantity';
  selectedAbsenceOption: string = ''; 
  onOptionChange: string = '';
  @Output() dataEvent = new EventEmitter<string>();

  constructor(
    private dialogRef: MatDialogRef<AddEditPrescriptionItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { popupType: string }
  ) {
   
  }
  ngOnInit(): void {
    this.showPopupBasedOnType();
      this.filteredRoutes = this.routes.slice(); 
    this.selectedRoute.valueChanges.subscribe((value) => {
      this.filterRoutes(value); 
    });
  }
  filterRoutes(value: string) {
    if (!value) {
      this.filteredRoutes = this.routes.slice(); 
    } else {
      const filterValue = value.toLowerCase();
      this.filteredRoutes = this.routes.filter((route) =>
        route.toLowerCase().includes(filterValue)
      ); 
    }
  }
  showItem() {
    const dataToSend = 'Data from child component';
    this.dataEvent.emit(dataToSend);
  }

  private showPopupBasedOnType() {
    switch (this.data.popupType) {
      case 'addItem':
        this.showAddItemPopup();
        break;
      case 'addDetails':
        this.showAddItemDetailsPopup();
        break;
      case 'addDosageTiming':
        this.showAddDosageTimingPopup();
        break;
      default:
        // Default behavior or error handling
        break;
    }
  }

  showAddItemPopup() {
    this.isAddItemVisible = true;
    this.isAddItemDetailsVisible = false;
    this.isAddDosageTimingVisible = false;
  }

  showAddItemDetailsPopup() {
    this.isAddItemVisible = false;
    this.isAddItemDetailsVisible = true;
    this.isAddDosageTimingVisible = false;
  }

  showAddDosageTimingPopup() {
    this.isAddItemVisible = false;
    this.isAddItemDetailsVisible = false;
    this.isAddDosageTimingVisible = true;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
