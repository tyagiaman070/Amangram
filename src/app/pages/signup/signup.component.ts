import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/services/auth.service';

import { v4 as uuidv4 } from 'uuid';

import { NgForm } from '@angular/forms';

import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import { readAndCompressImage } from 'browser-image-resizer';
import imageConfig from 'src/utils/config';

// TODO: ADD IMPORTS HERE
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  picture = '../../../assets/defaultUser.png';
  // TODO: ADD URL

  uploadPercent = null;
  isLoading = false;
  constructor(
    private auth: AuthService,
    private router: Router,
    private db: AngularFireDatabase,
    private toastr: ToastrService,
    private storage: AngularFireStorage,
    public ngFireAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {}

  onSubmit(f: NgForm) {
    const {
      email,
      password,
      username,
      confirmPassword,
      country,
      bio,
      name,
    } = f.form.value;
    // Check Values Further
    // TODO: || country === '---------'
    if (confirmPassword !== password) {
      // console.log('country', country);

      return this.toastr.error('Passwords do not match', '', {
        closeButton: true,
      });
    }
    this.isLoading = true;
    this.auth
      .signUp(email, password)
      .then((res) => {
        // console.log('RESPONSE AFTER SIGN UP', res);
        const { uid } = res.user;

        this.db.object(`/users/${uid}`).set({
          id: uid,
          name,
          email,
          instaUserName: username,
          country,
          bio,
          picture: this.picture,
          role: 0,
        });
      })
      .then(() => {
        this.ngFireAuth.currentUser.then((u) => u.sendEmailVerification());
        this.router.navigateByUrl('/addpost');
        this.toastr.success('SIGN UP SUCCESS, Verify Your Email', '', {
          closeButton: true,
        });
        this.isLoading = false;
      })
      .catch((err) => {
        this.isLoading = false;
        this.toastr.error(`ERROR IN SIGN UP ${err}`, '', {
          closeButton: true,
        });
        // console.log(err, 'ERROR IN SIGNUP.ts');
      });
  }

  async uploadFile(event) {
    const file = event.target.files[0];

    const resizedImage = await readAndCompressImage(file, imageConfig);

    const filePath = uuidv4();
    // TODO: RENAME THE IMAGE

    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizedImage);

    task.percentageChanges().subscribe((percentage) => {
      this.uploadPercent = percentage;
    });

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.picture = url;
            this.toastr.success('IMAGE UPLOAD SUCCESS', '', {
              closeButton: true,
            });
          });
        })
      )
      .subscribe();
  }
}
