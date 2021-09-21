const stats_min = require("./stats.min")
// @ponicode
describe("stats_min.default", () => {
    test("0", () => {
        let callFunction = () => {
            stats_min.default()
        }
    
        expect(callFunction).not.toThrow()
    })
})
