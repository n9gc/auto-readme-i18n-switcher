# README Multilingual Switcher Generator

<!-- auto-readme-i18n-switcher start -->
| English | [日本語](.github/README.ja.md) | [中文](.github/README.zh.md) |
<!-- auto-readme-i18n-switcher end -->

This generator is used to generate the multilingual switcher for the README file, which is the one above this sentence.

## Usage

This is an example.

Write the following in your `.github/workflows/readme-switcher.yml` file:

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

After that, every time you push to the master branch or create a pull request, the content between `<!-- auto-readme-i18n-switcher start -->` and `<!-- auto-readme-i18n-switcher end -->` in each README file (such as `README.en.md`, `README.zh.md`, etc.) inside your `.github` folder will be replaced with the multilingual switcher, and `.github/README.en.md` will also become the project's README file.

## Parameters

When using the Action, you can optionally set several input parameters.

### `folders`

These are the folders containing the README files, one per line.

Default is `'.'`.

### `fileName`

This is the filename pattern for the README files, using `{lang}` to match the language of the README.

The pattern follows the RFC 6570 standard.

Default is `'README.{lang}.md'`.

### `repoReadme`

A file path; the file at this path will finally be renamed to the project's `README`.

If you don't set it, i.e., the default empty string, the project's README file will not be touched.

Default is `''`.

### `tag`

The name of the HTML comment tag. For example, if set to `abc`, then

```md
<!-- abc start -->
The multilingual switcher will be inserted here.
<!-- abc end -->
```

Default is `'auto-readme-i18n-switcher'`.

### `switcherBody`

A template string, the outer framework of the multilingual switcher.

Follows the micromustache template syntax.
Parameters:

- `lines` inner text of the multilingual switcher

Default is `'| {{lines}} |'`.

### `switcherLine`

A template string for each available language option in the multilingual switcher.

Follows the micromustache template syntax.
Parameters:

- `display` localized language option
- `filePath` path of the corresponding file
- `folder` folder of the corresponding file
- `lang` the `{lang}` parsed from the filename

Default is `'[{{display}}]({{path}})'`.

### `switcherLineActive`

A template string for the current language option in the multilingual switcher.

Follows the micromustache template syntax.
Parameters are the same as `switcherLine`.

Default is `'{{display}}'`.

### `switcherSpliter`

A string used to separate the language options in the multilingual switcher.

Default is `' | '`.

