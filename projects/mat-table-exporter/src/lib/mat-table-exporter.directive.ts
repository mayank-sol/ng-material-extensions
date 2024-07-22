import {AfterViewInit, Directive, Host, Optional, Self} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {
  CdkTableExporter,
  DataExtractorService,
  ServiceLocatorService
} from '../../../../projects/cdk-table-exporter/src/public-api';
import {Observable} from 'rxjs';

@Directive({
  selector: '[matTableExporter]',
  exportAs: 'matTableExporter'
})
export class MatTableExporterDirective extends CdkTableExporter implements AfterViewInit {
  /**
   * Overriding ngAfterViewInit of TableExporter
   */
  ngAfterViewInit(): void {
    this.exportStarted.subscribe(_ => {
      this.enablePaginator(false);
    });
    this.exportCompleted.subscribe(_ => {
      this.enablePaginator(true);
    });
  }

  constructor(
    serviceLocator: ServiceLocatorService,
    dataExtractor: DataExtractorService,
    @Host() @Self() @Optional() table: MatTable<any>
  ) {
    super(serviceLocator, dataExtractor, table);
  }

  /**
   * MatTable implementation of getPageCount
   */
  public getPageCount(): number {
    const pageSize = this.getPageSize();
    if (pageSize == 0) {
      return 0;
    }
    const pageCount = this.getTotalItemsCount() / this.getPageSize();
    return Math.ceil(pageCount) ?? 1;
  }

  /**
   * MatTable implementation of getPageSize
   */
  public getPageSize(): number {
    return this.getPaginator()?.pageSize ?? 0;
  }

  /**
   * MatTable implementation of getCurrentPageIndex
   */
  public getCurrentPageIndex(): number {
    return this.getPaginator()?.pageIndex ?? 0;
  }

  /**
   * MatTable implementation of getTotalItemsCount
   */
  public getTotalItemsCount(): number {
    return this.getPaginator()?.length ?? this.getDataSource()?.data?.length ?? 0;
  }

  /**
   * MatTable implementation of goToPage
   */
  public goToPage(index: number): void {
    const paginator: MatPaginator = this.getPaginator();
    paginator.pageIndex = index;
    paginator._changePageSize(paginator.pageSize);
  }

  /**
   * MatTable implementation of getPageChangeObservable
   */
  public getPageChangeObservable(): Observable<any> | undefined {
    const paginator = this.getPaginator();
    if (paginator) {
      return paginator.page.asObservable();
    }
    return undefined;
  }

  private getDataSource(): MatTableDataSource<any> {
    return this._cdkTable.dataSource as MatTableDataSource<any>;
  }

  private getPaginator(): MatPaginator {
    return this.getDataSource()?.paginator as MatPaginator;
  }

  private enablePaginator(value: boolean) {
    const paginator: MatPaginator = this.getPaginator();
      paginator.disabled = !value;
      paginator._changePageSize(paginator.pageSize);
  }

}
