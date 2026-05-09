# README 多言語スイッチャーのジェネレーター

<!-- auto-readme-i18n-switcher start -->
| [English](.github/README.en.md) | 日本語 | [中文](.github/README.zh.md) |
<!-- auto-readme-i18n-switcher end -->

このジェネレーターは、上にあるような README ファイルの多言語スイッチャーを生成するためのものです。

## 使用方法

これはサンプルです。

`.github/workflows/readme-switcher.yml` ファイルに以下を記述します：

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

これにより、master ブランチへの push や PR のたびに、`.github` フォルダ内の `README.en.md` や `README.zh.md` といった各説明ファイルにある `<!-- auto-readme-i18n-switcher start -->` と `<!-- auto-readme-i18n-switcher end -->` の間の内容が、多言語スイッチャーに置き換えられます。また、`.github/README.en.md` がプロジェクトの README になります。

## パラメータの説明

アクションの使用時に、いくつかの入力パラメーターをオプションで設定できます。

## `folders`

README ファイルを含むフォルダです。1 行に 1 つ指定します。

デフォルトは `'.'` です。

## `fileName`

README ファイルのファイル名パターンです。`{lang}` を使用して言語をマッチングします。

パターンは RFC 6570 標準に準拠しています。

デフォルトは `'README.{lang}.md'` です。

## `repoReadme`

ファイルパスです。最終的にこのパスのファイルがプロジェクトの `README` にリネームされます。

設定しない場合（デフォルトの空文字列の場合）、プロジェクトの README は変更されません。

デフォルトは `''` です。

## `tag`

HTML コメントタグの名前です。たとえば `abc` に設定した場合、

```md
<!-- abc start -->
多言語スイッチャーがここに挿入されます
<!-- abc end -->
```

のようになります。

デフォルトは `'auto-readme-i18n-switcher'` です。

## `switcherBody`

テンプレート文字列で、多言語スイッチャーの外側のフレームです。

micromustache テンプレートの構文に従います。
パラメータ：

- `lines` 多言語スイッチャーの内部テキスト

デフォルトは `'| {{lines}} |'` です。

## `switcherLine`

テンプレート文字列で、多言語スイッチャーの各利用可能な言語オプションです。

micromustache テンプレートの構文に従います。
パラメータ：

- `display` ローカライズされた言語オプション
- `filePath` 対応するファイルのパス
- `folder` 対応するファイルのフォルダ
- `lang` 対応するファイル名から解析された `{lang}` です。

デフォルトは `'[{{display}}]({{path}})'` です。

## `switcherLineActive`

テンプレート文字列で、多言語スイッチャーの現在の言語オプションです。

micromustache テンプレートの構文に従います。
パラメータは `switcherLine` と同じです。

デフォルトは `'{{display}}'` です。

## `switcherSpliter`

文字列で、多言語スイッチャーの各言語オプションを分割するために使用されます。

デフォルトは `' | '` です。

