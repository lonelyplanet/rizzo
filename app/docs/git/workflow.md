# Git Workflow

This is the workflow you should adopt for a typical feature.

- Get the latest version of master

```
git pull origin master
```

- Create your own feature branch, prefixed by your initials. Branches should be scoped to one feature and short-lived.

```
git checkout -b iw-feature
```

- Discuss the feature with another developer, they should eventually review your code.

- Do some work

- Push to a remote branch, [rebasing](rebasing) beforehand if you have redundant commits which should be squashed

- Create a Pull Request

- Ask another developer to review the code

- Reply to comments and make amends

- Merge into master once you receive a +1

- Delete your feature branch
