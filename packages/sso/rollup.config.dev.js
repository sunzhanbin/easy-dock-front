import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';

const outputName = 'Auth';

const plugins = [
    //  Toggle the booleans here to enable / disable Phaser 3 features:
    replace({
        'typeof CANVAS_RENDERER': JSON.stringify(true),
        'typeof WEBGL_RENDERER': JSON.stringify(true),
        'typeof EXPERIMENTAL': JSON.stringify(true),
        'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
        'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
        'typeof FEATURE_SOUND': JSON.stringify(true),
        preventAssignment: true,
    }),

    //  Parse our .ts source files
    resolve({
        extensions: ['.ts', '.tsx'],
    }),

    //  We need to convert the Phaser 3 CJS modules into a format Rollup can use:
    commonjs({
        include: [],
        exclude: [],
        sourceMap: true,
        ignoreGlobal: true,
    }),

    //  See https://www.npmjs.com/package/rollup-plugin-typescript2 for config options
    typescript(),
];

export default {
    //  Our games entry point (edit as required)
    input: ['./src/index.ts'],
    //  Where the build file is to be generated.
    //  Most games being built for distribution can use iife as the module type.
    //  You can also use 'umd' if you need to ingest your game into another system.
    //  The 'intro' property can be removed if using Phaser 3.21 or above. Keep it for earlier versions.
    output: [
        { file: './dist/index.iife.js', format: 'iife', name: outputName },
        { file: './dist/sso.js', format: 'umd', name: outputName, intro: 'var global = window;' },
        { file: './dist/index.cjs.min.js', format: 'cjs', exports: 'default' },
        { file: './dist/index.esm.js', format: 'esm', intro: 'var global = window;' },
    ],

    plugins,
};
