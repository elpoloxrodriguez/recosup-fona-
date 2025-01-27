import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { EmailService } from 'app/main/dashboard/email/email.service';

@Component({
  selector: 'app-email-sidebar',
  templateUrl: './email-sidebar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class EmailSidebarComponent implements OnInit {
  // Public
  // public folders;
  // public labels;
  public folders = [
    {
      id: 0,
      handle: 'inbox',
      title: 'Bandeja Entrada',
      icon: 'mail'
    },
    {
      id: 1,
      handle: 'sent',
      title: 'Enviados',
      icon: 'send'
    },
    {
      id: 2,
      handle: 'draft',
      title: 'Borrador',
      icon: 'edit-2'
    },
    {
      id: 3,
      handle: 'spam',
      title: 'Spam',
      icon: 'info'
    },
    {
      id: 4,
      handle: 'trash',
      title: 'Papelera',
      icon: 'trash'
    }
  ];

  public labels = [
    {
      id: 0,
      handle: 'personal',
      title: 'Personal',
      color: 'bullet-success'
    },
    {
      id: 1,
      handle: 'company',
      title: 'Compañia',
      color: 'bullet-primary'
    },
    {
      id: 2,
      handle: 'important',
      title: 'Importante',
      color: 'bullet-warning'
    },
    {
      id: 3,
      handle: 'private',
      title: 'Privado',
      color: 'bullet-danger'
    }
  ];

  public openComposeRef;
  public draftCount;
  public unReadInboxCount;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {EmailService} _emailService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _emailService: EmailService, 
    private _coreSidebarService: CoreSidebarService
    ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open Compose & Update Value in Service
   */
  openCompose() {
    this.openComposeRef = true;
    this._emailService.composeEmail(this.openComposeRef);
    this._coreSidebarService.getSidebarRegistry('email-sidebar').toggleOpen();
  }

  /**
   * Toggle Sidebar
   *
   * @param nameRef
   */
  toggleSidebar(nameRef): void {
    this._coreSidebarService.getSidebarRegistry(nameRef).toggleOpen();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to Folder
    // this._emailService.onFoldersChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.folders = response;
    // });

    // Subscribe to Labels
    // this._emailService.onLabelsChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.labels = response;
    // });

    // Subscribe to Draft and Unread Mail Count
    this._emailService.onDraftCountChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => (this.draftCount = response));

    this._emailService.onUnreadInboxCountChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => (this.unReadInboxCount = response));
    
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
