import {Component, OnInit} from '@angular/core';
import {FormlyFieldConfig} from "@ngx-formly/core";
import {UntypedFormGroup} from "@angular/forms";
import {PosteType, RoleType, UserType} from "../../../../../app.types";
import {AdminUsersService} from "../../../services/admin-users.service";
import {BehaviorSubject, map, Observable} from "rxjs";
import * as _ from "lodash";
import {ActivatedRoute} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-create-mod-user',
  standalone: false,
  templateUrl: './create-mod-user.component.html',
  styleUrl: './create-mod-user.component.css'
})
export class CreateModUserComponent {

  constructor(
    public adminUsersService: AdminUsersService,
    public route: ActivatedRoute,
    public notif: ToastrService,
  ) {
    if (route.data.subscribe((data) => {
      switch (data['formState']) {
        case 'edit': {
          this.resetForm()
          this.importUserFromUrl()
          this._currentState$.next('edit')
          break
        }
        case 'add' : {
          this.resetForm()
          this._currentState$.next('add')
          break
        }
      }
    })) {

    }
  }

  private _currentState$ = new BehaviorSubject<"edit" | "add">('add');
  currentState$: Observable<"edit" | "add"> = this._currentState$.asObservable();

  showCancelModal: boolean = false;

  async importUserFromUrl() {
    this.adminUsersService.users$.subscribe((data) => {
      this.route.queryParams.subscribe((params: any) => {
        let user = data.find(user => user.username == params.username)
        if (!user) {
          return
        }
        this.userCreateModFormModel = user
        this.editOriginalUser = _.cloneDeep(user)
      })
    })
  }

  resetForm(): void {
    this.userCreateModForm.reset({})
  }

  submitUser() {
    this.currentState$.subscribe((state) => {
      switch (state) {
        case 'edit': {
          this.editUser()
          break
        }
        case 'add': {
          this.createUser()
          break
        }
      }
    })
  }

  createUser() {
    if (!this.userCreateModFormModel.customRoles) {
     this.userCreateModFormModel.roles = this.userCreateModFormModel.poste.roles
    }
    this.adminUsersService.createUser(this.userCreateModFormModel)
  }

  editUser() {
    this.userCreateModFormModel.password = ''
    if (!this.editOriginalUser) { // If the original objet may be empty --> due to not loading, but user modifies the UI
      this.notif.error("Les données utilisateurs n'ont pas été initialisées")
      return
    }
    this.adminUsersService.editUser(this.editOriginalUser, this.userCreateModFormModel) // Send the edit user to API
    this.editOriginalUser = this.userCreateModFormModel // Set the backup to the updated version
  }

  deleteUser() {
    if (!this.editOriginalUser) { // If the original objet may be empty --> due to not loading, but user modifies the UI
      this.notif.error("Les données utilisateurs n'ont pas été initialisées")
      return
    }
    this.adminUsersService.deleteUser(this.editOriginalUser)
    this.showCancelModal = false
  }

  get returnCurrentUser() {
    let object = _.cloneDeep(this.userCreateModFormModel);
    if (!object.customRoles) {
      object.roles = object.poste.roles
    }
    return object
  }

  editOriginalUser: UserType | undefined = undefined

  userCreateModForm: UntypedFormGroup = new UntypedFormGroup({});
  userCreateModFormModel: UserType = {
    customRoles: false,
    fullname: "",
    password: "",
    poste: {
      poste: '',
      roles: []
    },
    roles: [],
    username: ""
  }
  userCreateModInfosFormFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'columnForm',
      fieldGroup: [
        {
          id: 'fullname',
          key: 'fullname',
          type: 'input',
          props: {
            label: 'Nom complet',
            placeholder: 'Prénom NOM',
            type: 'text',
            required: true
          }
        },
        {
          id: 'username',
          key: 'username',
          type: 'input',
          props: {
            label: "Identifiant",
            placeholder: '0400152Y',
            type: 'text',
            required: true
          },
        },
        {
          id: 'password',
          key: 'password',
          type: 'input',
          props: {
            label: "Mot de passe",
            type: 'password',
            placeholder: "R8sOX?OG$wqO6PQ$0T",
            required: true
          },
          hooks: {
            onInit: (field) => {
              this.currentState$.subscribe((status) => {
                return field.hide = (status == 'edit')
              })
            }
          }
        }
      ]
    }
  ]

  userCreateModRolesFormFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'columnForm',
      fieldGroup: [
        {
          id: 'poste',
          key: 'poste',
          type: 'select',
          props: {
            label: "Poste",
            required: true,
          },
          expressions: {
            'props.options': (field) => {
              this.adminUsersService.postes$.pipe(
                map((postes: PosteType[]) => {
                  return postes.map(poste => ({
                    label: poste.poste,
                    value: poste
                  }));
                })
              ).subscribe(options => {
                field.props!.options = options;
              });
            }
          }
        },
        {
          key: 'customRoles',
          type: 'switch',
          props: {
            label: "Rôles personalisés"
          }
        },
        {
          id: 'roles',
          key: 'roles',
          type: 'select',
          props: {
            label: "Rôle",
            required: true,
            multiple: true,
            styles: {
              input: {
                'max-width': '25em',
              }
            }
          },
          expressions: {
            'props.options': (field) => {
              this.adminUsersService.roles$.pipe(
                map((roles: RoleType[]) => {
                  return roles.map(role => ({
                    label: role,
                    value: role
                  }));
                })
              ).subscribe(options => {
                field.props!.options = options;
              });
            },
            'hide': (field) => {
              return !field.model?.customRoles;
            }
          }
        }
      ]
    }
  ]

  get formValid() {
    return this.userCreateModForm.valid;
  }

  get getPasswordStrenght(): {score: number, message: string} {
    if (this.userCreateModFormModel.password) {
      return this.adminUsersService.analyzePasswordStrength(this.userCreateModFormModel.password)
    }
    return {score: 0, message: 'Inexistant...'};
  }

}
