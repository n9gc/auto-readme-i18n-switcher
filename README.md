# 「精确类型」多包项目模板

[![All test](https://github.com/accurtype/monodemo/actions/workflows/test-all.yml/badge.svg)](https://github.com/accurtype/monodemo/actions/workflows/test-all.yml)

如何工程化地开发多包 JS 项目是一个值得思考的问题，一旦你解决了这个问题，开发就会变成一个愉悦且可控制的过程。

然而，这个问题通常来说费时费脑！这种情况下，你为什么不直接用「精确类型」多包项目模板呢？

## 本项目工程化的方面

- pnpm workspace
- 默认全 TypeScript + ESModule ，通过 tsx 或高版本的 node
- 使用 prittier 和 eslint 组合进行 lint
- 通过 git hooks 保证代码的质量
- 使用 commitlint 来检查提交格式
- 同时使用 czg 来更方便地提交
- 自动构建和测试的线上 Actions
- 可自定义编译流程的 Pages 来构建文档
- 和 Cargo Workspace 的集成
- 赞助信息

下面就本模板的几个独特之处简单介绍。

## 纯粹的 TypeScript 开发体验

> 本模板的两个目标是
>
> 1. 如果可以在 ts 和 js 里选择，那一定选择 ts
> 2. 如果只能用 js ，那也要 js + jsDoc

以上目标已经过时了，本模板限制 Node 版本 `>=22.18.0` ，新的目标是：

1. 如果可以用 node 跑 ts ，那就用 node ，不能用 node 还有 `tsx`
3. 如果要在浏览器里跑，就用 esbuild

默认的 TypeScript 配置经过了实践验证，开箱即用。

## 独立，清晰，高自由度的配置

本模板的基本所有项目配置都放在 `./config/` 中。

这也是一个 js 包，可单独声明依赖，一并进行 lint 和类型检查等。

- `.prettierignore` 为 prettier 的忽略文件
- `commitlint.ts` 为 commitlint 和 czg 的配置文件
- `env.sh` 设想是在在打开项目时需要执行的一个小脚本，你可以随意修改它
- `eslint.flat.ts` 为 eslint 的配置
- `tsbase.json` 为整个项目的基本 TS 配置

## 经过验证的文档构建 Actions 流程

为合理的网站构建流程而发愁？
如果你选择了本模板，那你什么也不用想，写好网站本身就够了。

`./docs/` 这个 js 包就是你的网站，你可以随意配置构建脚本。
在你每次 push 后，你的网站都会被 Actions 在线构建，并将产物推到 `gh-pages` 分支，即可衔接 GitHub Pages 或任何其他托管服务。

## 和 Cargo Workspace 的配合

有的时候你的 js 项目可能会混入 rust 写的 wasm ，你可能会觉得那样的话项目管理就会变得很棘手。

为了方便这种情景，本模板除了是一个 pnpm workspace 之外，其实还是一个 Cargo Workspace 。
这样子， pnpm 的 scripts 等功能照常使用，而 rust 的开发也没有耽误，与 js 的配合更是方便。

本模板提供了一个示例 `./packages/test_wasm/` 供你探索。

