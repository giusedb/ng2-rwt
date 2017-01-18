import { Input, Component, OnInit, EventEmitter, ElementRef } from '@angular/core';
declare var Lazy;

@Component({
  selector: '[rwt-permission-table]',
  template: `
      <tr>
        <th></th>
        <th *ngFor="let permName of allPermissions">
          {{ permName }}
        </th>
      </tr>
      <tr *ngFor="let perm of permissions" >
        <th>{{ perm[0].description }}</th>
        <td *ngFor="let p of allPermissions" [rwtToggle]="{bindTo:perm[1], attribute: p}">
          {{ perm[1][p]?'X':'' }}
        </td>
      </tr>
      <tr>
        <th title="grant access to a group not listed upon">
          Add new group
        </th>
          <td [rwtData]="{resource : 'auth_group', localFilter: notInTable}" #group *ngIf="groupsReady">
          <select [(ngModel)]="newGroup" name="newGroup">
            <option [value]="item.id" *ngFor="let item of group.items">{{ item.description }}</option>
          </select>
        </td>
        <td>
          <button (click)="addUser(newGroup)">Add</button>
        </td>
      </tr>
  `,
  inputs: ['rwtModel'],
  outputs: ['saved'],
})
export class RwtPermissionTableComponent implements OnInit {
  private obj: any;
  private permissions: any;
  private allPermissions: Array<string> = [];
  private permissionTable: any;
  private saved: EventEmitter<Object> = new EventEmitter();
  private notInTable: Function;
  private groupsReady: boolean = false;
  private permissioned: any;
  //private newGroup: any;

  constructor(protected er: ElementRef) { 
    this.notInTable = (group) => 
      !this.permissioned.contains(group.id);
  }

  ngOnInit() {
  }

  @Input() set rwtModel (obj) {
    this.obj = obj;
    obj.all_perms((permissions) => {
      this.allPermissions = obj.constructor.allPermissions;
      this.permissions = permissions.permissions;
      this.permissionTable = permissions;
      this.permissioned = Lazy(this.permissions).map((x) => x[0].id);
      this.groupsReady = true;
    })
  }

  save() {
    this.permissionTable.save((x) => {
        this.saved.emit();
    })
  }

  addUser(group) {
    this.permissionTable.push(group, {});
  }

}

