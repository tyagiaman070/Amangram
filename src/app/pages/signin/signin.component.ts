import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  isLoading = false;
  constructor(
    private authApna: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private firebaseAuth: AngularFireModule,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {}

  onSubmit(f: NgForm) {
    const { email, password, confirmPassword } = f.form.value;

    if (confirmPassword !== password) {
      return this.toastr.error('Password do not match', '', {
        closeButton: true,
      });
    }
    this.isLoading = true;
    this.authApna
      .signIn(email, password)
      .then((res) => {
        this.toastr.success('Sign In Success', '', {
          closeButton: true,
        });
        this.isLoading = false;
        this.router.navigateByUrl('/');
      })

      .catch((err) => {
        this.isLoading = false;
        this.toastr.error(err.message, '', {
          closeButton: true,
        });
      });
  }
  // async signInwithGoogle() {
  //   const provider = new auth.GoogleAuthProvider();
  // const credential = await this.afAuth.auth.signInWithPopup(provider);
  // console.log(credential.user);

  // this.afAuth.auth
  //   .signInWithPopup(provider)
  //   .then((result) => {
  //     // This gives you a Google Access Token. You can use it to access the Google API.
  //     const token = result.credential.accessToken;
  //     // The signed-in user info.
  //     const user = result.user;
  //     // ...
  //   })
  //   .catch((error) => {
  //     // Handle Errors here.
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     // The email of the user's account used.
  //     const email = error.email;
  //     // The firebase.auth.AuthCredential type that was used.
  //     const credential = error.credential;
  //     // ...
  //   });
  // }
}
