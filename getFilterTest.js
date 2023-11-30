const getFilter = require('./appService');

describe('getFilter', () => {
    it('should handle a single condition', () => {
        const filter = [['age', 30]];
        expect(getFilter(filter)).toBe("age = '30'");
    });

    it('should handle multiple conditions with AND', () => {
        const filter = [['age', 30, 'AND'], ['passes', 200]];
        expect(getFilter(filter)).toBe("age = '30' AND passes = '200'");
    });

    it('should handle multiple conditions with OR', () => {
        const filter = [['age', 30, 'OR'], ['passes', 200]];
        expect(getFilter(filter)).toBe("age = '30' OR passes = '200'");
    });

    it('should handle a mix of AND and OR', () => {
        const filter = [['age', 30, 'AND'], ['passes', 200, 'OR'], ['age', 18]];
        expect(getFilter(filter)).toBe("age = '30' AND passes = '200' OR age = '18'");
    });

    it('should handle invalid inputs such as an empty array', () => {
        const filter = [];
        expect(getFilter(filter)).toBe("");
    });

});