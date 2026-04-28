import next from 'eslint-config-next/core-web-vitals';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'scripts/**', 'tests/**', 'next-env.d.ts'],
  },
  ...next,
];
