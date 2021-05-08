import { Component, OnInit } from '@angular/core';
import {GoodsService} from '../../../shopping/service/goods.service';
import {BillService} from '../../../shopping/service/bill.service';
import {Bill} from '../../../shopping/model/Bill.class';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  public bills: Bill[] = [];
  p: any;
  constructor(
    private billService: BillService,
  ) { }

  ngOnInit(): void {
    this.billService.getAllBill().subscribe(data => {
      this.bills = data;
      console.log(this.bills);
    });
  }

}
