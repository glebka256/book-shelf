import auth from "@/config/auth";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

const protectedRoutes = ["users-manager"];

export async function authGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    if (protectedRoutes.includes(to.name as string)) {
        const isAuthorized = await auth.api.getLoginStatus();
        if (isAuthorized) {
            next();
        } else {
            next({ name: 'login', query: { redirect: to.fullPath } });
        }
    } else {
        next();
    }
}