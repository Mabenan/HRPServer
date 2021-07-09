
export class Ingredient extends Parse.Object {

    constructor() {
        super("Ingredient");
    } 

    public get Name(): string{
        return this.get<string>("Name");
    }

    public set Name(value: string)
    {
        this.set("Name", value);
    }
}