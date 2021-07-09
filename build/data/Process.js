"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = void 0;
class Process extends Parse.Object {
    get Name() {
        return this.get("Name");
    }
    set Name(value) {
        this.set("Name", value);
    }
    constructor() {
        super("Process");
    }
}
exports.Process = Process;
//# sourceMappingURL=Process.js.map