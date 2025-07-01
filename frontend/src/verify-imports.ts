// File di test per verificare gli import
// Questo file verifica che tutti gli import dei tipi funzionino correttamente

import { Deadline, DeadlinePriority, DeadlineStatus } from './types';

console.log('✅ Import test started...');

// Test 1: Verifica che i tipi siano importati correttamente
const testDeadline: Deadline = {
  id: 'test-1',
  userId: 'user-1',
  title: 'Test Deadline',
  description: 'Testing import resolution',
  dueDate: new Date().toISOString(),
  category: 'test',
  priority: 'high' as DeadlinePriority,
  status: 'pending' as DeadlineStatus,
  reminderDays: 7,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

console.log('✅ Deadline type imported successfully');
console.log('Test deadline:', testDeadline);

// Test 2: Verifica tutti i valori di enum
const priorities: DeadlinePriority[] = ['low', 'medium', 'high', 'urgent'];
const statuses: DeadlineStatus[] = ['pending', 'completed', 'overdue'];

console.log('✅ All enum values tested successfully');
console.log('Priorities:', priorities);
console.log('Statuses:', statuses);

console.log('\n✅ All imports are working correctly!');

export {}; // Make this a module
