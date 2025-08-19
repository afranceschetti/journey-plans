import { UserCredential } from "@angular/fire/auth";
import { DocumentData } from "@angular/fire/firestore";

export class User {
    docId: string | null;
    uid: string;
    email: string;
    username: string;
    role: string;

    constructor(docId: string | null, uid: string, email: string, username: string, role: string) {
        this.docId = docId;
        this.uid = uid;
        this.email = email;
        this.username = username;
        this.role = role;
    }

    public static createFromUserCredential(docId: string | null, userCredential: UserCredential) {
        return new User(docId, userCredential.user.uid, "" + userCredential.user.email, "" + userCredential.user.displayName, "base");
    }

    public static createFromDocumentData(docId: string, documentData: DocumentData) {
        return new User(docId, documentData["uid"], documentData["email"], documentData["username"], documentData["role"]);
    }

    public static cleanBeforeUpdate(user: User) {
        return {
            uid: user.uid,
            email: user.email,
            username: user.username,
            role: user.role
        }
    }


    public static get USER_ROLE_BASE() { return "base" };
    public static get USER_ROLE_ADMIN() { return "admin" };

    public static get USER_ROLES() {
        return [this.USER_ROLE_BASE, this.USER_ROLE_ADMIN];
    }
}