'use strict'
const expect = require("chai").expect;
const game = require("../games.js");

describe("Game module", () => {
    it("returns game", () => {
        let result = game.get("Animal Crossing");
        expect(result).to.deep.equal({title: "Animal Crossing", genre: "Simulation", year:2001});
    });
    it("fails to return valid", () => {
        let result = game.get("Apple");
        expect(result).to.be.undefined;
    });
    it("add new game", () => {
        let result = game.add({title: "Sims", genre: "Simulation", year:2000});
        expect(result.added).to.be.true;
    });
    it("fail to add existing game", () => {
        let result = game.add({title: "Animal Crossing", genre: "Simulation", year:2001});
        expect(result.added).to.be.false;
    });
    it("deletes existing game", () => {
        let result = game.delete("Pokemon: Crystal");
        expect(result.deleted).to.be.true;
    });
    it("fail to delete invalid game", () => {
        let result = game.delete("Dragonball");
        expect(result.deleted).to.be.false;
    });
});