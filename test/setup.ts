import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
    console.log('Test database cleared');
  } catch (error) {
    console.log("test.sqlite doesn't exist");
  }
});
