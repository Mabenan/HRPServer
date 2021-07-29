import { Relation, Role, Schema } from "parse";
import { Ingredient } from "./Ingredient";
import { Market } from "./Market";
import { Price } from "./Price";
import { Process } from "./Process";
import { Product } from "./Product";
import { Receipt } from "./Receipt";
import { Recipe } from "./Recipe";
import { HRPUser } from "./User";
import { randomBytes } from "crypto";


class FieldDef {
    name?: string = "";
    type?: string = "";
    target?: string = "";
    defaultValue?: any;
}

export class InitProcess {


    async init() {
        var roles = (await new Parse.Query<Role>("_Role").equalTo("name", "Admin").find({useMasterKey: true}));
        if (roles.length == 0) {
            const roleACL = new Parse.ACL();
            roleACL.setPublicReadAccess(true);
            var role = new Parse.Role("Admin", roleACL);
            role = await role.save(null,{useMasterKey: true});
            var pass = randomBytes(20).toString('hex');
            var user = new HRPUser();
            user.set("username", "admin");
            user.set("password", pass);
            user.set("email", "admin@admin.com");
            user = await user.save(null,{useMasterKey: true});
            role.getUsers().add(user);
            role = await role.save(null,{useMasterKey: true});
            console.log("TMPAdmin: " + pass);
        }
        roles = (await new Parse.Query<Role>("_Role").equalTo("name", "User").find({useMasterKey: true}));
        if (roles.length == 0) {
            const roleACL = new Parse.ACL();
            roleACL.setPublicReadAccess(true);
            var role = new Parse.Role("User", roleACL);
            role = await role.save(null,{useMasterKey: true});
        }
        await this.initObject<Process>([
            { name: "Name", type: "String" },
            { name: "CurrentStep", type: "Number" },
            { name: "Running", type: "Boolean" },
            { name: "Progress", type: "Number" }
        ], Process, {
            find: { requiresAuthentication: undefined, 'role:Admin': true },
            get: {  requiresAuthentication: undefined, 'role:Admin': true },
            count: {  requiresAuthentication: undefined, 'role:Admin': true },
            create: {  requiresAuthentication: undefined, 'role:Admin': true },
            update: {  requiresAuthentication: undefined, 'role:Admin': true },
            delete: {  requiresAuthentication: undefined, 'role:Admin': true },
            addField: {  requiresAuthentication: undefined, 'role:Admin': true }
        });
        await this.initObject<Ingredient>([
            { name: "Name", type: "String" }
        ], Ingredient, {
            find: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            get: {  requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            count: {  requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            create: {  requiresAuthentication: undefined, 'role:Admin': true },
            update: {  requiresAuthentication: undefined, 'role:Admin': true },
            delete: {  requiresAuthentication: undefined, 'role:Admin': true },
            addField: {  requiresAuthentication: undefined, 'role:Admin': true }
        });
        await this.initObject<Recipe>([
            { name: "Name", type: "String" },
            { name: "Ingredients", type: "Relation", target: "Ingredient" }
        ], Recipe, {
            find: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            get: {  requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            count: {  requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            create: {  requiresAuthentication: undefined, 'role:Admin': true },
            update: {  requiresAuthentication: undefined, 'role:Admin': true },
            delete: {  requiresAuthentication: undefined, 'role:Admin': true },
            addField: {  requiresAuthentication: undefined, 'role:Admin': true }
        });
        await this.initObject<Receipt>([
            { name: "Name", type: "String" },
            { name: "Image", type: "File" },
            { name: "Processed", type: "Boolean", defaultValue: false },
            { name: "Market", type: "Pointer", target: "Market" },
            { name: "Prices", type: "Relation", target: "Price" }
        ], Receipt, {
            find: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            get: {  requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            count: {  requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            create: {  requiresAuthentication: undefined, 'role:Admin': true },
            update: {  requiresAuthentication: undefined, 'role:Admin': true },
            delete: {  requiresAuthentication: undefined, 'role:Admin': true },
            addField: {  requiresAuthentication: undefined, 'role:Admin': true }
        });
        await this.initObject<Product>([
            { name: "Name", type: "String" },
        ], Product, {
            find: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            get: {  requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            count: {  requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            create: {  requiresAuthentication: undefined, 'role:Admin': true },
            update: {  requiresAuthentication: undefined, 'role:Admin': true },
            delete: {  requiresAuthentication: undefined, 'role:Admin': true },
            addField: {  requiresAuthentication: undefined, 'role:Admin': true }
        });
        await this.initObject<Price>([
            { name: "Name", type: "String" },
            { name: "Date", type: "Date" }, ,
            { name: "Costs", type: "Number" },
            { name: "Product", type: "Pointer", target: "Product" },
            { name: "PossibleProducts", type: "Relation", target: "Product" },
            { name: "NeedsManualIntervention", type: "Boolean", defaultValue: false }
        ], Price, {
            find: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            get: {  requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            count: {  requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            create: {  requiresAuthentication: undefined, 'role:Admin': true },
            update: {  requiresAuthentication: undefined, 'role:Admin': true },
            delete: {  requiresAuthentication: undefined, 'role:Admin': true },
            addField: {  requiresAuthentication: undefined, 'role:Admin': true }
        });
        await this.initObject<Market>([
            { name: "Name", type: "String" },
            { name: "Interpretation", type: "String", defaultValue: "return null;" }
        ], Market, {
            find: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            get: {  requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            count: {  requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            create: {  requiresAuthentication: undefined, 'role:Admin': true },
            update: {  requiresAuthentication: undefined, 'role:Admin': true },
            delete: {  requiresAuthentication: undefined, 'role:Admin': true },
            addField: {  requiresAuthentication: undefined, 'role:Admin': true }
        });
        await this.initObject<HRPUser>([
            { name: "ProfilePic", type: "File" }
        ], HRPUser, {
            find: { requiresAuthentication: undefined, 'role:Admin': true,},
            get: {  requiresAuthentication: undefined, 'role:Admin': true, },
            count: {  requiresAuthentication: undefined, 'role:Admin': true, },
            create: {  requiresAuthentication: undefined, 'role:Admin': true },
            update: {  requiresAuthentication: undefined, 'role:Admin': true },
            delete: {  requiresAuthentication: undefined, 'role:Admin': true },
            addField: {  requiresAuthentication: undefined, 'role:Admin': true }
        });

    }

    async initObject<T extends Parse.Object = any>(fields: FieldDef[], testType: new () => T, clp: Schema.CLP = null) {
        var testInstance = new testType();
        var schemaExist = true;
        var schema: any = new Parse.Schema(testInstance.className);
        var schema2: any = { fields: {} };
        await schema.get().then((val: any) => schema2 = val).catch(() => schemaExist = false);
        fields.forEach(element => {
            switch (element.type) {
                case "Relation":
                    schema2.fields.hasOwnProperty(element.name) ? null : schema.addRelation(element.name, element.target);
                    break;
                case "Pointer":
                    schema2.fields.hasOwnProperty(element.name) ? null : schema.addPointer(element.name, element.target);
                    break;
                default:
                    schema2.fields.hasOwnProperty(element.name) ? null : schema["add" + element.type](element.name, { defaultValue: element.defaultValue });
                    break;
            }
        });
        if (clp != null) {
            schema.setCLP(clp);
        }
        schemaExist ? await schema.update() : await schema.save();
    }
}