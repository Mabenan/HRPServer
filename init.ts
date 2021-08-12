import { Relation, Role, Schema } from "parse";
import { Ingredient } from "./data/Ingredient";
import { Market } from "./data/Market";
import { Price } from "./data/Price";
import { Product } from "./data/Product";
import { Receipt } from "./data/Receipt";
import { Recipe } from "./data/Recipe";
import { HRPUser } from "./data/User";
import { randomBytes } from "crypto";
import { HRPTask } from "./data/Task";
import * as ServerManager from "server-manager-api";

export class InitProcess {


    async init() {
        var roles = (await new Parse.Query<Role>("_Role").equalTo("name", "Admin").find({ useMasterKey: true }));
        if (roles.length == 0) {
            const roleACL = new Parse.ACL();
            roleACL.setPublicReadAccess(true);
            var role = new Parse.Role("Admin", roleACL);
            role = await role.save(null, { useMasterKey: true });
            var pass = randomBytes(20).toString('hex');
            var user = new HRPUser();
            user.set("username", "admin");
            user.set("password", pass);
            user.set("email", "admin@admin.com");
            user = await user.save(null, { useMasterKey: true });
            role.getUsers().add(user);
            role = await role.save(null, { useMasterKey: true });
            console.log("TMPAdmin: " + pass);
        }
        roles = (await new Parse.Query<Role>("_Role").equalTo("name", "User").find({ useMasterKey: true }));
        if (roles.length == 0) {
            const roleACL = new Parse.ACL();
            roleACL.setPublicReadAccess(true);
            var role = new Parse.Role("User", roleACL);
            role = await role.save(null, { useMasterKey: true });
        }

        Parse.Object.registerSubclass("Recipe", Recipe);
        Parse.Object.registerSubclass("Ingredient", Ingredient);
        Parse.Object.registerSubclass("Receipt", Receipt);
        Parse.Object.registerSubclass("Product", Product);
        Parse.Object.registerSubclass("Price", Price);
        Parse.Object.registerSubclass("Market", Market);
        Parse.Object.registerSubclass("Task", HRPTask);
        Parse.Object.registerSubclass("_User", HRPUser);
        await ServerManager.ProcessInit();
        await ServerManager.Schema.initObject<Ingredient>([
            { name: "Name", type: "String" }
        ], Ingredient, {
            find: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            get: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            count: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            create: { requiresAuthentication: undefined, 'role:Admin': true },
            update: { requiresAuthentication: undefined, 'role:Admin': true },
            delete: { requiresAuthentication: undefined, 'role:Admin': true },
            addField: { requiresAuthentication: undefined, 'role:Admin': true }
        });
        await ServerManager.Schema.initObject<Recipe>([
            { name: "Name", type: "String" },
            { name: "Ingredients", type: "Relation", target: "Ingredient" }
        ], Recipe, {
            find: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            get: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            count: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            create: { requiresAuthentication: undefined, 'role:Admin': true },
            update: { requiresAuthentication: undefined, 'role:Admin': true },
            delete: { requiresAuthentication: undefined, 'role:Admin': true },
            addField: { requiresAuthentication: undefined, 'role:Admin': true }
        });
        await ServerManager.Schema.initObject<Receipt>([
            { name: "Name", type: "String" },
            { name: "Image", type: "File" },
            { name: "Processed", type: "Boolean", defaultValue: false },
            { name: "Market", type: "Pointer", target: "Market" },
            { name: "Prices", type: "Relation", target: "Price" }
        ], Receipt, {
            find: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            get: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            count: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            create: { requiresAuthentication: undefined, 'role:Admin': true },
            update: { requiresAuthentication: undefined, 'role:Admin': true },
            delete: { requiresAuthentication: undefined, 'role:Admin': true },
            addField: { requiresAuthentication: undefined, 'role:Admin': true }
        });
        await ServerManager.Schema.initObject<Product>([
            { name: "Name", type: "String" },
        ], Product, {
            find: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            get: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            count: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            create: { requiresAuthentication: undefined, 'role:Admin': true },
            update: { requiresAuthentication: undefined, 'role:Admin': true },
            delete: { requiresAuthentication: undefined, 'role:Admin': true },
            addField: { requiresAuthentication: undefined, 'role:Admin': true }
        });
        await ServerManager.Schema.initObject<Price>([
            { name: "Name", type: "String" },
            { name: "Date", type: "Date" }, ,
            { name: "Costs", type: "Number" },
            { name: "Product", type: "Pointer", target: "Product" },
            { name: "PossibleProducts", type: "Relation", target: "Product" },
            { name: "NeedsManualIntervention", type: "Boolean", defaultValue: false }
        ], Price, {
            find: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            get: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            count: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            create: { requiresAuthentication: undefined, 'role:Admin': true },
            update: { requiresAuthentication: undefined, 'role:Admin': true },
            delete: { requiresAuthentication: undefined, 'role:Admin': true },
            addField: { requiresAuthentication: undefined, 'role:Admin': true }
        });
        await ServerManager.Schema.initObject<Market>([
            { name: "Name", type: "String" },
            { name: "Interpretation", type: "String", defaultValue: "return null;" }
        ], Market, {
            find: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            get: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            count: { requiresAuthentication: undefined, 'role:Admin': true, 'role:User': true },
            create: { requiresAuthentication: undefined, 'role:Admin': true },
            update: { requiresAuthentication: undefined, 'role:Admin': true },
            delete: { requiresAuthentication: undefined, 'role:Admin': true },
            addField: { requiresAuthentication: undefined, 'role:Admin': true }
        });
        await ServerManager.Schema.initObject<HRPUser>([
            { name: "ProfilePic", type: "File" },
            { name: "Points", type: "Number" }
        ], HRPUser, {
            find: { requiresAuthentication: undefined, 'role:Admin': true, },
            get: { requiresAuthentication: undefined, 'role:Admin': true, },
            count: { requiresAuthentication: undefined, 'role:Admin': true, },
            create: { requiresAuthentication: undefined, 'role:Admin': true },
            update: { requiresAuthentication: undefined, 'role:Admin': true },
            delete: { requiresAuthentication: undefined, 'role:Admin': true },
            addField: { requiresAuthentication: undefined, 'role:Admin': true }
        });

        await ServerManager.Schema.initObject<HRPTask>([
            { name: "Name", type: "String" },
            { name: "Prio", type: "Number" },
            { name: "Points", type: "Number" },
            { name: "Frequenz", type: "Number" },
            { name: "Responsible", type: "Pointer", target: "_User" },
            { name: "DueDate", type: "Date" },
            { name: "LastSolved", type: "Date" }
        ], HRPTask, {
            find: { requiresAuthentication: undefined, 'role:Admin': true, },
            get: { requiresAuthentication: undefined, 'role:Admin': true, },
            count: { requiresAuthentication: undefined, 'role:Admin': true, },
            create: { requiresAuthentication: undefined, 'role:Admin': true },
            update: { requiresAuthentication: undefined, 'role:Admin': true },
            delete: { requiresAuthentication: undefined, 'role:Admin': true },
            addField: { requiresAuthentication: undefined, 'role:Admin': true }
        });


    }
}

new InitProcess().init();