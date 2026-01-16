/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseExpectedContrastRatio } from './color-utils.js';

describe('color-utils', () => {
  describe('parseExpectedContrastRatio', () => {
    describe('valid inputs from axe-core', () => {
      const axeCoreValidValues = [
        { input: '3:1', expected: 3, description: 'WCAG AA large text' },
        { input: '4.5:1', expected: 4.5, description: 'WCAG AA normal text' },
        { input: '7:1', expected: 7, description: 'WCAG AAA normal text' },
      ];

      axeCoreValidValues.forEach(({ input, expected, description }) => {
        it(`should parse "${input}" to ${expected} - ${description}`, () => {
          const result = parseExpectedContrastRatio(input);
          assert.strictEqual(result, expected);
        });
      });
    });

    describe('invalid inputs - edge cases from LLM extraction errors', () => {
      const invalidTestCases = [
        { input: '', description: 'empty string (LLM failed to extract)' },
        { input: 'undefined', description: 'string literal "undefined" (LLM error)' },
        { input: '0:1', description: 'zero ratio (invalid WCAG value)' },
        { input: '-4.5:1', description: 'negative ratio (corrupted data)' },
        { input: ':1', description: 'missing number (malformed extraction)' },
        { input: 'NaN:1', description: 'NaN string (parsing error)' },
        { input: 'abc:1', description: 'non-numeric prefix (malformed data)' },
      ];

      invalidTestCases.forEach(({ input, description }) => {
        it(`should throw error for ${description}: "${input}"`, () => {
          assert.throws(
            () => parseExpectedContrastRatio(input),
            {
              name: 'Error',
              message: /Invalid contrast ratio format/,
            }
          );
        });
      });
    });
  });
});