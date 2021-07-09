import { Product } from "./Product";

export class Price extends Parse.Object {

    constructor() {
        super("Price");
    }

    public get Name() : String{
        return this.get("Name");
    }
    public set Name(value: String){
         this.set("Name", value);
    }
    public get Costs() : number{
        return this.get("Costs");
    }
    public set Costs(value: number){
         this.set("Costs", value);
    }

    public get Date() : Date{
        return this.get("Date");
    }
    public set Date(value: Date){
         this.set("Date", value);
    }
    public get Product() : Product{
        return this.get("Product");
    }

    public set Product(value: Product){
        this.set("Product", value);
    }

    public get PossibleProducts() : Parse.Relation {
        return this.relation("PossibleProducts");
    }

    public get NeedsManualIntervention() : boolean{
        return this.get("NeedsManualIntervention");
    }

    public set NeedsManualIntervention(value: boolean){
        this.set("NeedsManualIntervention", value);
    }
}