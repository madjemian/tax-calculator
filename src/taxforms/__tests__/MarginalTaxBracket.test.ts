import { Form1040 } from '../1040';
import { UserInputStore } from '../../stores/UserInputStore';

describe('Marginal Tax Bracket', () => {
    let store: UserInputStore;
    let form: Form1040;

    beforeEach(() => {
        store = new UserInputStore();
        form = new Form1040(store);
    });

    it('should return correct bracket for low income', () => {
        // Taxable income = 20000 (10% bracket)
        // Need to set inputs such that line 15 is 20000
        // Standard deduction is 32200
        // So income needs to be 52200
        store.addW2Income('Test', 52200);

        const result = form.marginalTaxBracket;
        expect(result.rate).toBe(0.10);
        expect(result.remaining).toBe(24800 - 20000);
    });

    it('should return correct bracket for middle income', () => {
        // Taxable income = 150000 (22% bracket: 100800 - 211400)
        store.addW2Income('Test', 150000 + 32200);

        const result = form.marginalTaxBracket;
        expect(result.rate).toBe(0.22);
        expect(result.remaining).toBe(211400 - 150000);
    });

    it('should return correct bracket for high income', () => {
        // Taxable income = 1000000 (37% bracket: > 768700)
        store.addW2Income('Test', 1000000 + 32200);

        const result = form.marginalTaxBracket;
        expect(result.rate).toBe(0.37);
        expect(result.remaining).toBe(Infinity);
    });

    it('should handle boundary conditions', () => {
        // Exact top of 12% bracket: 100800
        store.addW2Income('Test', 100800 + 32200);

        const result = form.marginalTaxBracket;
        expect(result.rate).toBe(0.12);
        expect(result.remaining).toBe(0);
    });
});
