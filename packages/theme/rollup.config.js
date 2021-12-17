import typescript from '@wessberg/rollup-plugin-ts';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import { uglify } from "rollup-plugin-uglify";
import { babel } from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy'

export default [
  {
    input: 'src/variable.css',
    output: {
      file: 'dist/variable.css',
    },
    plugins: [
      postcss({
        minimize: true,
        extract: true,
        use: [
          ['less', { javascriptEnabled: true }]
        ]
      })
    ]
  },
  {
    input: 'src/utils.ts',
    output: [
      { file: "dist/utils.esm.js", format: "esm" },
    ],
    plugins: [
      resolve({ extensions: ['.ts'], browser: true }),
      typescript(),
      babel({
        exclude: '**/node_modules/**',
        babelHelpers: 'bundled'
      }),
      uglify(),
      copy({
        targets: [
          { src: 'src/react', dest: 'dist/' },
          { src: 'src/vue', dest: 'dist/' },
        ]
      })
    ]
  }
];
