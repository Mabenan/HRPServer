import { HRPUser } from "./User";

export class HRPTask extends Parse.Object{
    constructor(){
        super("Task");
    }

    
    public get Name(): string{
        return this.get<string>("Name");
    }

    public set Name(value: string)
    {
        this.set("Name", value);
    }

    public get DueDate(): Date{
        return this.get("DueDate");
    }

    public set DueDate(value: Date){
        this.set("DueDate", value);
    }

    public get LastSolved(): Date{
        return this.get("LastSolved");
    }

    public set LastSolved(value: Date){
        this.set("LastSolved", value);
    }

    public get Frequenz(): number{
        return this.get("Frequenz");
    }

    public set Frequenz(value: number){
        this.set("Frequenz", value);
    }
    
    public get Prio(): number{
        return this.get("Prio");
    }

    public set Prio(value: number){
        this.set("Prio", value);
    }

    public get Points() : number{
        return this.get("Points");
    }

    public set Points(value: number){
        this.set("Points", value);
    }
    
    public get Responsible(): HRPUser{
        return this.get("Responsible");
    }


}