import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

export default [
    // CJS & ESM
    {
        input: 'src/index',
        external: ['ms'],
        output: [
            { file: pkg.main, format: 'cjs' },
            { file: pkg.module, format: 'es' },
        ],
    },

    // UMD
    {
        input: 'src/index',
        output: {
            name: 'howLongUntilLunch',
            file: pkg.browser,
            format: 'umd',
        },
        plugins: [
            resolve(), // so Rollup can find `ms`
            babel({
                exclude: 'node_modules/**',
            }),
            commonjs(), // so Rollup can convert `ms` to an ES module
        ],
    },
]
