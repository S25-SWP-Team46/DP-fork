import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Example test for a simple component
// This ensures Jest can run and provides a baseline test
describe('Frontend Test Setup', () => {
  test('renders a simple div element', () => {
    const TestComponent = () => <div data-testid="test-element">Hello World</div>;
    
    render(<TestComponent />);
    
    const element = screen.getByTestId('test-element');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Hello World');
  });

  test('basic math operations work', () => {
    expect(2 + 2).toBe(4);
    expect(5 * 3).toBe(15);
  });

  test('string operations work', () => {
    const testString = 'Hello World';
    expect(testString).toMatch(/Hello/);
    expect(testString.length).toBe(11);
  });
});

// Test for environment setup
describe('Environment Configuration', () => {
  test('CI environment is detected correctly', () => {
    // This will help verify CI environment setup
    const isCI = process.env.CI === 'true';
    expect(typeof isCI).toBe('boolean');
  });

  test('Node environment is test', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});

export default {};
