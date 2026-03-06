import { calculateFare, getDistance } from '../lib/fareUtils';

describe('Fare Calculation Utilities', () => {
  test('calculateFare returns correct value for given distance', () => {
    expect(calculateFare(10)).toBe(350);
    expect(calculateFare(5, 50, 20)).toBe(150);
  });

  test('getDistance calculates distance between two points', () => {
    const lat1 = -1.286389;
    const lon1 = 36.817223;
    const lat2 = -1.2921;
    const lon2 = 36.8219;
    const distance = getDistance(lat1, lon1, lat2, lon2);
    expect(distance).toBeGreaterThan(0.5);
    expect(distance).toBeLessThan(1.5);
  });
});
