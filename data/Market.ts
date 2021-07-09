
export class Market extends Parse.Object {
    get Interpretation(): string {
        return this.get("Interpretation");
    }

    constructor() {
        super("Market");
    }

}