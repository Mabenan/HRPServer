import { Relation, Schema } from "parse";
import { Ingredient } from "./Ingredient";
import { Market } from "./Market";
import { Price } from "./Price";
import { Process } from "./Process";
import { Product } from "./Product";
import { Receipt } from "./Receipt";
import { Recipe } from "./Recipe";


class FieldDef {
    name?: string = "";
    type?: string = "";
    target?: string = "";
    defaultValue?: any;
}

export class InitProcess {


    async init() {

        await this.initObject<Process>([
            { name: "Name", type: "String" },
            { name: "CurrentStep", type: "Number" },
            { name: "Running", type: "Boolean" },
            { name: "Progress", type: "Number" }
        ], Process);
        await this.initObject<Ingredient>([
            { name: "Name", type: "String" }
        ], Ingredient);
        await this.initObject<Recipe>([
            { name: "Name", type: "String" },
            { name: "Ingredients", type: "Relation", target: "Ingredient" }
        ], Recipe);
        await this.initObject<Receipt>([
            { name: "Name", type: "String" },
            { name: "Image", type: "File" },
            { name: "Processed", type: "Boolean", defaultValue: false },
            { name: "Market", type: "Pointer", target: "Market" },
            { name: "Prices", type: "Relation", target: "Price" }
        ], Receipt);
        await this.initObject<Product>([
            { name: "Name", type: "String" },
        ], Product);
        await this.initObject<Price>([
            { name: "Name", type: "String" },
            { name: "Date", type: "Date" },,
            { name: "Costs", type: "Number" },
            { name: "Product", type: "Pointer", target: "Product" },
            { name: "PossibleProducts", type: "Relation", target: "Product" },
            { name: "NeedsManualIntervention", type: "Boolean", defaultValue: false }
        ], Price);
        await this.initObject<Market>([
            { name: "Name", type: "String" },
            { name: "Interpretation", type:"String", defaultValue: "return null;"}
        ], Market);


    }

    async initObject<T extends Parse.Object = any>(fields: FieldDef[], testType: new () => T) {
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
                    schema2.fields.hasOwnProperty(element.name) ? null : schema["add" + element.type](element.name, {defaultValue: element.defaultValue});
                    break;
            }
        });
        schemaExist ? await schema.update() : await schema.save();
    }
}