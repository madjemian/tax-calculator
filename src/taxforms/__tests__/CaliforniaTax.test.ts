import { CaliforniaTax } from '../CaliforniaTax';
import { UserInputStore } from '../../stores/UserInputStore';

describe('CaliforniaTax', () => {
    let store: UserInputStore;
    let caTax: CaliforniaTax;

    beforeEach(() => {
        store = new UserInputStore();
        // Clear default W2 entries created in constructor
        store.w2Income = []; 
        caTax = new CaliforniaTax(store);
    });

    const setIncome = (amount: number) => {
        // Reset income
        store.w2Income = [];
        store.addW2Income('Test Income', amount);
    };

    it('should calculate 0 tax for 0 income', () => {
        setIncome(0);
        expect(caTax.calculateFullCATax()).toBeCloseTo(0, 2);
    });

    it('should calculate correct tax at first bracket max (21512)', () => {
        // Max bracket 1: 21512 @ 1%
        // Tax: 21512 * 0.01 = 215.12
        setIncome(21512);
        expect(caTax.calculateFullCATax()).toBeCloseTo(215.12, 2);
    });

    it('should calculate correct tax at second bracket max (50998)', () => {
        // Bracket 2: 21512 - 50998 @ 2%
        // Prev Tax: 215.12
        // This bracket: (50998 - 21512) * 0.02 = 589.72
        // Total: 804.84
        setIncome(50998);
        expect(caTax.calculateFullCATax()).toBeCloseTo(804.84, 2);
    });

    it('should calculate correct tax at third bracket max (80490)', () => {
        // Bracket 3: 50998 - 80490 @ 4%
        // Prev Tax: 804.84
        // This bracket: (80490 - 50998) * 0.04 = 1179.68
        // Total: 1984.52
        setIncome(80490);
        expect(caTax.calculateFullCATax()).toBeCloseTo(1984.52, 2);
    });

    it('should calculate correct tax at fourth bracket max (111732)', () => {
        // Bracket 4: 80490 - 111732 @ 6%
        // Prev Tax: 1984.52
        // This bracket: (111732 - 80490) * 0.06 = 1874.52
        // Total: 3859.04
        setIncome(111732);
        expect(caTax.calculateFullCATax()).toBeCloseTo(3859.04, 2);
    });

    it('should calculate correct tax at fifth bracket max (141212)', () => {
        // Bracket 5: 111732 - 141212 @ 8%
        // Prev Tax: 3859.04
        // This bracket: (141212 - 111732) * 0.08 = 2358.40
        // Total: 6217.44
        setIncome(141212);
        expect(caTax.calculateFullCATax()).toBeCloseTo(6217.44, 2);
    });

    it('should calculate correct tax at sixth bracket max (721318)', () => {
        // Bracket 6: 141212 - 721318 @ 9.3%
        // Prev Tax: 6217.44
        // This bracket: (721318 - 141212) * 0.093 = 53949.858 -> 53949.86
        // Total: 60167.30
        setIncome(721318);
        expect(caTax.calculateFullCATax()).toBeCloseTo(60167.30, 2);
    });

    it('should calculate correct tax at seventh bracket max (865574)', () => {
        // Bracket 7: 721318 - 865574 @ 10.3%
        // Prev Tax: 60167.30
        // This bracket: (865574 - 721318) * 0.103 = 14858.368 -> 14858.37
        // Total: 75025.67
        setIncome(865574);
        expect(caTax.calculateFullCATax()).toBeCloseTo(75025.67, 2);
    });

    it('should calculate correct tax at eighth bracket max (1442628)', () => {
        // Bracket 8: 865574 - 1442628 @ 11.3%
        // Prev Tax: 75025.67
        // This bracket: (1442628 - 865574) * 0.113 = 65207.102 -> 65207.10
        // Total: 140232.77
        setIncome(1442628);
        expect(caTax.calculateFullCATax()).toBeCloseTo(140232.77, 2);
    });
    
    it('should calculate correct tax well into the top bracket (2000000)', () => {
        // Top Bracket: > 1442628 @ 12.3%
        // Prev Tax: 140232.77
        // Income: 2,000,000
        // Taxable in top bracket: 2000000 - 1442628 = 557372
        // Tax on top: 557372 * 0.123 = 68556.756 -> 68556.76 (rounded? usually not at intermediate unless specified)
        // Wait, the class uses calculated offsets.
        // The class logic: topBracket.offset + (taxableAtTopBracket * topBracket.rate)
        // 140232.77 + (557372 * 0.123) = 140232.77 + 68556.756 = 208789.526
        
        setIncome(2000000);
        expect(caTax.calculateFullCATax()).toBeCloseTo(208789.53, 2); 
    });
});