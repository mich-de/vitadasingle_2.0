// Test file to debug import resolution
console.log('=== TESTING IMPORT RESOLUTION ===');

// Test 1: Relative import
try {
  import type { CreateDeadlineInput } from './types';
  console.log('✅ Relative import ./types works for CreateDeadlineInput');
} catch (e) {
  console.error('❌ Relative import ./types failed:', e);
}

// Test 2: Direct entity import
try {
  import type { CreateDeadlineInput } from './types/entities/deadline';
  console.log('✅ Direct import from deadline.ts works');
} catch (e) {
  console.error('❌ Direct import from deadline.ts failed:', e);
}

// Test 3: Check all exports
import * as allTypes from './types';
console.log('\nExported types containing "Deadline":');
Object.keys(allTypes).filter(key => key.includes('Deadline')).forEach(key => {
  console.log(`- ${key}`);
});

export {};
