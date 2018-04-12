import { Component, OnInit } from '@angular/core';
import { CategoryFirebaseServiceProvider } from '../../services/firebase/category-firebase-service-provider';
import { SqliteCallbackModel } from '../../models/sqlite-callback-model';
import { ITdDataTableColumn, TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, IPageChangeEvent } from '@covalent/core';
import { CategoryModel } from '../../models/categories/category-model';
import { TdLoadingService } from '@covalent/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  items: any[];
  haveCategories: boolean = false;

  constructor(private _router: Router, private categoryFirebaseServiceProvider: CategoryFirebaseServiceProvider,
    private _loadingService: TdLoadingService) { }

  ngOnInit() {
    this.filterData();
  }

  filterData() {
    this._loadingService.register('category.list');
    this.categoryFirebaseServiceProvider.getAll((e) => this.getAllCallback(e));
  }

  getAllCallback(result: SqliteCallbackModel) {
    this._loadingService.resolve('category.list');
    if (result.success === false) {
      // console.log(result.data);
      // this.toast.showToast('Error');
      alert('Error');
      alert(JSON.stringify(result.data));
    }

    // console.log(result.data);
    this.items = result.data;
  }

  detailClick(item) {
    let obj = { guidId: item.guidId };
    // console.log(obj);

    this._router.navigate(['/category-add-modify/' + item.guidId]);
    // this._router.navigate(['/category-add-modify']);
  }
}
