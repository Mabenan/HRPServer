import { Receipt } from "../data/Receipt";
import { Product } from "../data/Product";
import { Price } from "../data/Price";
import fetch from "node-fetch";
import async from "async";
import * as tess from "node-tesseract-ocr";
import * as fs from "fs";
import { format, parse } from "date-format-parse";
import * as ServerManager from "server-manager-api";

class PriceConstruct {
    constructor(public name: String, public price: number, public bio: boolean) { }
}

export class ReceipeProcessor {

    processReceipes(process: ServerManager.Process): Promise<void> {
        return new Promise<void>(async (res, rej) => {
            const processQuery = new Parse.Query<Receipt>("Receipt");
            processQuery.equalTo("Processed", false);
            processQuery.include("Market");
            var receipes: Receipt[] = await processQuery.find({ useMasterKey: true });
            var receipeCount = receipes.length;
            process.newStep();
            async.forEachOfLimit(receipes, 10, async (Receipt: Receipt, key, cb): Promise<void> => {
                fs.mkdirSync("buffer", { recursive: true });
                const imgFile = "buffer/" + Receipt.id + Receipt.Image.name();
                fs.writeFileSync(imgFile, (await (await fetch(Receipt.Image.url())).buffer()));
                const text = await tess.recognize(imgFile, { lang: "deu" });
                fs.unlinkSync(imgFile);
                var lines: string[] = text.split("\r\n");
                var foundDate = this.getDate(lines);
                if (foundDate === null) {
                    foundDate = new Date();
                }
                for (const line of lines) {
                    var priceConstruct: PriceConstruct
                    eval(Receipt.Market.Interpretation);
                    if (priceConstruct != null) {
                        
                        var priceObject = new Price();
                        priceObject.Name = priceConstruct.name;
                        priceObject.Costs = priceConstruct.price;
                        priceObject.Date = foundDate;
                        var productQuery = new Parse.Query<Product>("Product");
                        var priceQuery = new Parse.Query<Price>("Price");
                        productQuery.matchesKeyInQuery("objectId", "Product.objectId", priceQuery.equalTo("Name", priceObject.Name));
                        var products = await productQuery.find({ useMasterKey: true });
                        priceObject = await priceObject.save(null, { useMasterKey: true });
                        if (products.length == 1) {
                            priceObject.Product = products[0];
                            await priceObject.save(null, { useMasterKey: true });
                        }
                        else if (products.length > 1) {
                            priceObject.PossibleProducts.add(products);
                            priceObject.NeedsManualIntervention = true;
                            await priceObject.save(null, { useMasterKey: true });

                        } else {
                            priceObject.NeedsManualIntervention = true;
                            await priceObject.save(null, { useMasterKey: true });
                        }
                        Receipt.Prices.add(priceObject)
                    }
                }
                Receipt.Processed = true;
                await Receipt.save(null, { useMasterKey: true });
                process.makeProgress(1 / receipeCount);
                cb();
            }).catch((err) => rej(err));
            res();
        });
    }

    getDate(lines: String[]): Date {
        var datLines = lines.filter((element) => element.includes("Datum"));
        for (const line of datLines) {
            var datElements = line.split(" ");
            for (const datEle of datElements) {
                try {
                    var date: Date = parse(datEle, "DD.MM.YY");
                    if (!isNaN(date.getTime())) {
                        return date;
                    }
                    date = parse(datEle, "DD.MM.YYYY");
                    if (!isNaN(date.getTime())) {
                        return date;
                    }


                } catch (err) {

                }

            }

        }

    }

}