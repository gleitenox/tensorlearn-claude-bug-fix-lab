import test from 'node:test';
import assert from 'node:assert/strict';
import { getClaim } from '../../src/claims.mjs';

// Incident: viewer user-4 received claim-B, which belongs to user-42.
test('viewer user-4 does not receive claim-B owned by user-42', () => {
  const claimB = { id: 'claim-B', ownerId: 'user-42', status: 'pending' };
  assert.equal(getClaim([claimB], 'user-4', 'claim-B'), null);
});

test('user-42 still receives their own claim-B', () => {
  const claimB = { id: 'claim-B', ownerId: 'user-42', status: 'pending' };
  assert.equal(getClaim([claimB], 'user-42', 'claim-B'), claimB);
});

test('overlapping owners each receive only their own claim', () => {
  const claims = [
    { id: 'claim-B', ownerId: 'user-42', status: 'pending' },
    { id: 'claim-B', ownerId: 'user-4', status: 'approved' },
  ];
  assert.equal(getClaim(claims, 'user-4', 'claim-B'), claims[1]);
  assert.equal(getClaim(claims, ' user-42 ', 'claim-B '), claims[0]);
});

test('empty, whitespace-only or non-string viewers receive nothing', () => {
  const claimB = { id: 'claim-B', ownerId: 'user-42', status: 'pending' };
  for (const viewer of ['', '   ', null, undefined, 42, {}, true]) {
    assert.equal(getClaim([claimB], viewer, 'claim-B'), null);
  }
});

test('input list and records are not mutated', () => {
  const claimB = { id: 'claim-B', ownerId: 'user-42', status: 'pending' };
  const claims = [claimB];
  getClaim(claims, 'user-4', 'claim-B');
  getClaim(claims, 'user-42', 'claim-B');
  assert.deepEqual(claims, [{ id: 'claim-B', ownerId: 'user-42', status: 'pending' }]);
  assert.equal(claims[0], claimB);
});
