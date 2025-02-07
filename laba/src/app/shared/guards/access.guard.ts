import { inject } from "@angular/core"
import { ModalService } from "../../auth/modal.service"
import { Router, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const canActivateAuth = (): boolean | UrlTree  => {
    const isLoggedIn = inject(AuthService).isLoggedIn();

    if(isLoggedIn) {
        return true
    }

    console.log("аутентифицирован?")
    console.log(isLoggedIn)
    return inject(Router).createUrlTree(['/error'])
}