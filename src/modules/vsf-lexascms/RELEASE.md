Release
================================================================

Creating a new release is mostly an automated process using 
[release-it](https://github.com/release-it/release-it/) and 
[lerna-changelog](https://github.com/lerna/lerna-changelog/).


Preparing the Release
----------------------------------------------------------------

Before a new release can be created, it is important to check that all pull 
requests that have been merged since the last release have been appropriately 
labeled and that they have clear and understandable titles.

Pull requests must be labelled with one of the following:

- **breaking** - Used for backwards incompatible changes
- **enhancement** - Used for new features or enhancements which are backwards compatible
- **bug** - Used when the PR fixes an existing bug
- **documentation** - Used when a PR adds or updates documentation
- **internal** - Used when a PR makes internal changes which should still be mentioned in the changelog


Release
----------------------------------------------------------------

Once all of the pull requests have appropriate labels and titles, follow the
below instructions to create a new release.

### 1. Install the project dependencies

```bash
yarn install
```

### 2. Create the release

In order to complete this step, you'll need a GitHub personal access token with 
"repo" scope access. Your access token **does not** require access to any other 
scopes.

```bash
export GITHUB_AUTH="YOUR_GITHUB_ACCESS_TOKEN"
yarn run release-it
```

Follow the prompts from [release-it](https://github.com/release-it/release-it/) 
which will manage the process of creating the release and pushing it to GitHub.