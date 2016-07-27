import {Component} from '@angular/core';
import {NgForm, NgFor} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import { TOOLTIP_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

@Component ({
    selector: 'register',
    templateUrl: 'app/components/Register/register.html',
    styleUrls: ['dist/app/components/Register/register.css'],
    directives: [NgFor, TOOLTIP_DIRECTIVES],
    providers: [AuthService, UserService]
})

export class RegisterComponent{
    constructor(private authService: AuthService, private userService: UserService) {}

    ngOnInit() {
        this.userService.gradeRange().subscribe(
            gradeRange => {
                this.gradeRange = gradeRange;
                console.log(gradeRange)
            },
            error => {
                this.errMsg = error;
                this.submitted = true;
            }
        )
    }

    gradeRange = [];
    repeatPass = '';
    form = {
        user:'',
        password: '',
        firstName: '',
        lastName: '',
        gradYear: null,
        teacher: false
    };
    submitted = false;
    submitSuccess = false;
    errMsg = '';
    onSubmit() {
        let postForm = this.form;
        postForm['grad-year'] = this.form['grad-year'].toString();
        this.submitted = true;
        this.authService.register(this.form).subscribe(
            res => {
                this.submitSuccess = true;
                this.submitted = true;
                console.dir(this.form)
            },
            error => {
                this.errMsg = error;
                this.submitSuccess = false;
                this.submitted = false;
            }
        )
    }

    changeEmail() {
        this.submitted = false;
        this.submitSuccess = false;
    }
}
