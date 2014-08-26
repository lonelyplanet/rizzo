# Git guidelines

- Always work in a branch
- Avoid unnecessary merges of master into your branch - if you are the only person working on your branch, rebase onto master instead. Use git pull --rebase to avoid commits like: `Merge remote-tracking branch 'origin/master' into if_feature`.
- Squash your commits into meaningful and (release|revert)able chunks
- Merge with --no-ff back into master when it has been code reviewed (or merge through the Github UI).
- Make your commit messages useful, no jokes. Follow
  [Git commit message best practices](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
  as much as possible (first line should be a <= 50 character summary of your changes, followed by a blank line and, if appropriate for larger changes, a detailed description wrapped to approx. 72 characters).
