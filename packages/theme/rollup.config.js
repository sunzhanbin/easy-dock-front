import path from 'path';

import typescript from '@wessberg/rollup-plugin-ts';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
// import { uglify } from "rollup-plugin-uglify";
import { terser } from 'rollup-plugin-terser';
import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';

export default [
  {
    input: 'src/variable.less',
    output: {
      file: 'dist/variable.css'
    },
    plugins: [
      postcss({
        minimize: true,
        extract: true,
        use: [['less', { javascriptEnabled: true }]]
      })
    ]
  },
  {
    input: 'src/utils.ts',
    output: [{ file: 'dist/utils.esm.js', format: 'esm' }],
    plugins: [
      resolve({ extensions: ['.ts'], browser: true }),
      typescript(),
      getBabelOutputPlugin({
        presets: [
          [
            '@babel/preset-env',
            {
              // 设置为false, 否则babel会在rollup有机会执行其操作之前导致我们的模块转化为commonjs
              modules: false,
            }
          ]
        ],
        plugins: ['@babel/plugin-proposal-optional-chaining']
      }),
      babel({
        include: 'src/*',
        babelHelpers: 'bundled'
      }),
      terser(),
      copy({
        targets: [
          { src: 'src/react', dest: 'dist/' },
          { src: 'src/vue', dest: 'dist/' }
        ]
      })
    ]
  }
];
