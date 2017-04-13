import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { UserProfileService } from '../../../../../../core/services/user-profile/user-profile.service';
import { LoginService } from '../../../../../../core/services/login/login.service';

import { Country } from '../../../../../../core/models/country';
import { Region } from '../../../../../../core/models/region';
import { Locality } from '../../../../../../core/models/locality';
import { Address } from '../../../../../../core/models/address';
import { UserProfile } from '../../../../../../core/models/user-profile';

import { constants } from '../../../../../../core/common/constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  userProfile: UserProfile = new UserProfile();

  complexForm: FormGroup;

  private currentDate: Date = new Date();

  constructor(private userProfileService: UserProfileService, private loginService: LoginService, private fb: FormBuilder, private router: Router) {
    this.userProfile.addresses = [];
    this.complexForm = this.fb.group({
      'name': this.buildNameFormControl(),
      'familyName': this.buildNameFormControl(),
      'birthDate': this.buildBirthDateControl(),
      'gender': this.buildGenderFormControl()
    });
  }

  private buildNameFormControl(value?: string): FormControl {
    return new FormControl(value, [Validators.required, Validators.minLength(2)]);
  }

  private buildBirthDateControl(value?: Date): FormControl {
    return new FormControl(value, [CustomValidators.dateISO, CustomValidators.maxDate(this.currentDate)]);
  }

  private buildGenderFormControl(value?: any): FormControl {
    return new FormControl(value, []);
  }

  ngOnInit() {
    try {
      this.userProfileService.getUserProfile().subscribe(
        (userProfile) => {
          if (userProfile) {
            this.userProfile = userProfile;

            this.complexForm = this.fb.group({
              'name': this.buildNameFormControl(userProfile.name),
              'familyName': this.buildNameFormControl(userProfile.familyName),
              'birthDate': this.buildBirthDateControl(userProfile.birthDate),
              'gender': this.buildGenderFormControl(userProfile.gender)
            });

            this.fixIndexAddress();
          } else {
            this.userProfile = new UserProfile();
          }
        }
      );
    } catch (e) {
      console.log('Error at profile load');
      console.log(e);
    }
  }

  private fixIndexAddress() {
    if (this.userProfile.addresses) {
      for (let i = 0; i < this.userProfile.addresses.length; i++) {
        this.userProfile.addresses[i].index = i + '';
      }
    }
  }

  submitForm(form: any) {
    this.userProfile.name = form.name;
    this.userProfile.familyName = form.familyName;
    if (form.birthDate) {
      this.userProfile.birthDate = new Date(form.birthDate);
    } else {
      this.userProfile.birthDate = null;
    }

    if (form.gender) {
      this.userProfile.gender = form.gender;
    } else {
      this.userProfile.gender = null;
    }

    this.userProfileService.updateUserProfile(this.userProfile).subscribe(
      (res) => {
        this.loginService.getLoggedUser().name = this.userProfile.name + ' ' + this.userProfile.familyName;
        alert('The information was successfully saved');
        this.router.navigate([constants.defaultLoggedRoute]);
      },
      (error) => {
        console.error(error);
        alert('Error...');
      }
    );
  }

  confirmDelete(index: string) {
    if (confirm('¿Estas seguro? ' + index)) {
      this.userProfileService.deleteAddress(index).subscribe(
        (res) => {
          this.userProfile.addresses.splice(Number(index), 1);
          this.fixIndexAddress();
          alert('The information was successfully saved');
        },
        (error) => {
          console.error(error);
          alert('Error');
        }
      );
    }
  }

}
