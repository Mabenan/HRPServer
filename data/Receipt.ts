import { Market } from "./Market";

export class Receipt extends Parse.Object {

    constructor() {
        super("Receipt");
    } 

    public get Image() : Parse.File {
        return this.get("Image");
    }

    public get Processed() : boolean {
        return this.get("Processed");
    }

    public get Prices(): Parse.Relation{
        return this.relation("Prices");
    }

    public get Market(): Market{
        return this.get("Market");
    }

    public set Processed(value : boolean){
        this.set("Processed", value);
    }
}