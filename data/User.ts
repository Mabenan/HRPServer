export class HRPUser extends Parse.User {

    
    public get ProfilePic(): Parse.File{
        return this.get("ProfilePic");
    }

    public set ProfilePic(value:  Parse.File)
    {
        this.set("ProfilePic", value);
    }
    public get Points() : Number{
        return this.get("Points");
    }

    public set Points(value: Number){
        this.set("Points", value);
    }

}