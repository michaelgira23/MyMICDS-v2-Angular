import {Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {LocalStorage, SessionStorage} from 'h5webstorage';

import {NavbarComponent} from './components/Navbar/navbar.component';
import {HomeComponent} from './components/Home/home.component';
import {LunchComponent} from './components/Lunch/lunch.component';
import {PlannerComponent} from './components/Planner/planner.component';
import {DailyBulletinComponent} from './components/DailyBulletin/daily-bulletin.component';
import {BulletinArchivesComponent} from './components/BulletinArchives/bulletin-archives.component';
import {SettingsComponent} from './components/Settings/settings.component';
import {AboutComponent} from './components/About/about.component';
import {LoginComponent} from './components/Login/login.component';
import {LogoutComponent} from './components/Logout/logout.component';
import {RegisterComponent} from './components/Register/register.component';
import {ConfirmComponent} from './components/Confirm/confirm.component';
import {ForgotPasswordComponent} from './components/ForgotPassword/forgot-password.component';
import {ResetPasswordComponent} from './components/ResetPassword/reset-password.component';
import {SidebarComponent} from './components/Sidebar/sidebar.component'

import {AuthService} from './services/auth.service';
import {CanvasService} from './services/canvas.service';
import {PortalService} from './services/portal.service';
import {UserService} from './services/user.service';


@Component({
	selector: 'mymicds-app',
	template: `
		<navbar></navbar>
		<sidebar></sidebar>
		<router-outlet></router-outlet>
	`,
	styles: [':host { height: 100%; }'],
	providers: [HTTP_PROVIDERS, LocalStorage, SessionStorage, AuthService, CanvasService, PortalService, UserService],
	directives: [NavbarComponent, ROUTER_DIRECTIVES, SidebarComponent],
	precompile: [
				NavbarComponent,         HomeComponent,          LunchComponent,
				PlannerComponent,        DailyBulletinComponent, BulletinArchivesComponent,
				SettingsComponent,       AboutComponent,         LoginComponent,
				LogoutComponent,         RegisterComponent,      ConfirmComponent,
				ForgotPasswordComponent, ResetPasswordComponent
			]
})
export class AppComponent {}
