# 自述文件多语言切换器的生成器

<!-- auto-readme-i18n-switcher start -->
<!-- auto-readme-i18n-switcher end -->

本生成器用于生成自述文件的多语言切换器，就是这句话上面的那个。

## 使用方法

这是一个示例。

在你的 `.github/workflows/readme-switcher.yml` 文件里写这些：

```yaml
name: I18n Switcher of Readme

on:
    push:
        branches: ['master']
    pull_request:
        branches: ['master']

permissions:
    contents: write

jobs:
    switcher:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@master
              with:
                  persist-credentials: false
                  fetch-depth: 0

            - id: switcher
              uses: n9gc/auto-readme-i18n-switcher@master
              with:
                  folders: |
                      .github
                  repoReadme: '.github/README.en.md'

            - name: Push Branch
              if: steps.switcher.outputs.switcher_changed == 'true'
              uses: actions-js/push@master
              with:
                  github_token: ${{ secrets.GITHUB_TOKEN }}
                  branch: master
                  message: 'doc: Update README switcher'
```

之后在你每次向 master 分支的 push 和 PR 的时候，你在 `.github` 文件夹里的各个例如 `README.en.md` `README.zh.md` 之类的说明文件里的 `<!-- auto-readme-i18n-switcher start -->` 和 `<!-- auto-readme-i18n-switcher end -->` 之间的内容就都会被替换为多语言切换器了，并且 `.github/README.en.md` 还会变为项目的自述文件。

## 参数介绍

使用 Action 的时候，你可以选择性地设置几个输入参数。

## `folders`

这是包含自述文件的文件夹，一行一个。

默认为 `'.'` 。

## `fileName`

这是自述文件的文件名模式，使用 `{lang}` 来匹配自述文件的语言。

模式遵循 RFC 6570 标准。

默认为 `'README.{lang}.md'` 。

## `repoReadme`

一个文件路径，最后会把这个路径的文件重命名为项目的 `README` 。

如果你不设置，也就是默认的空字符串的话，就不动项目的自述文件。

默认为 `''` 。

## `tag`

HTML 注释标签的名称，例如如果设置为了 `abc` ，那么

```md
<!-- abc start -->
多语言切换器会被填充在这里
<!-- abc end -->
```

默认为 `'auto-readme-i18n-switcher'` 。

## `switcherBody`

一个模板字符串，多语言切换器的外部框架。

遵循 micromustache 模板的语法。
参数：

- `lines` 多语言切换器的内部文本

默认为 `'| {{lines}} |'` 。

## `switcherLine`

一个模板字符串，多语言切换器的每个可用语言选项。

遵循 micromustache 模板的语法。
参数：

- `display` 本地化后的语言选项
- `filePath` 对应文件的路径
- `folder` 对应文件的文件夹
- `lang` 对应文件的文件名中分析出来的 `{lang}` 。

默认为 `'[{{display}}]({{path}})'` 。

## `switcherLineActive`

一个模板字符串，多语言切换器当前的语言选项。

遵循 micromustache 模板的语法。
参数与 `switcherLine` 相同。

默认为 `'{{display}}'` 。

## `switcherSpliter`

一个字符串，用于分割多语言切换器的各个语言选项。

默认为 `' | '` 。

