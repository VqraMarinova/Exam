import {showError, showInfo} from "../notification.js";
import {register, checkResult, login, logout} from "../data.js";

export async function registerPage(){
    this.partials={
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),

    }
    this.partial('./templates/user/register.hbs',)

}
export async function registerPost(){
    try {
        if ((this.params.email.trim()).length === 0){
            throw new Error('Email can not be empty');
        }
        if (this.params.password.length < 6) {
            throw new Error('Password must be at least 6 chars long');
        }
        if (this.params.password !== this.params.repeatPassword) {
            throw new Error('Passwords do not match');
        }
        const result = await register(
            this.params.email,
            this.params.password,
            );
        checkResult(result);
        const loginResult = await login(this.params.email, this.params.password);
        checkResult(loginResult);

        this.app.userData.email = loginResult.email;
        this.app.userData.userId = loginResult.objectId;


        showInfo("Successful registration!");
        this.redirect('#/home')

    }catch (error){
            showError(error.message);
    }


}

export async function loginPage() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),

    }
    this.partial('./templates/user/login.hbs',)
}
export async function loginPost(){
    try {
        const result = await login(
            this.params.email,
            this.params.password
        );
        checkResult(result);

        this.app.userData.email = result.email;
        this.app.userData.userId = result.objectId;

        showInfo("Login successful.");
        this.redirect('#/home')

    }catch (error){
        showError(error.message);
    }

}

export async function getLogout(){
    try {
        await logout();
        this.app.userData.email = '';
        this.app.userData.userId = '';
        showInfo("Successful logout");
        this.redirect('#/home');
    } catch (error){
        showError(error.message);
    }

}