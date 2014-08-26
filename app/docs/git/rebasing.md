# Rebasing

We ask for branches to be rebased to avoid/squash commits like:

    [1da4dc3] Merge remote-tracking branch 'origin/master' into if-feature

    [4cb8dd2] Add specs

    [7fc1ae8] Ugh... dumb fix

These commits are of no use when looking at the git history and can get in the way of finding the point at which a feature/bug landed in master.

Rebasing causes lots of problems when first getting started though. [This article](http://phuu.net/2014/02/24/rebase-you-interactively-for-great-good.html) by Tom Ashworth helpfully explains everything you need to know about rebasing with git. 

## Important

If you remember no other fact: know that when you rebase locally you are rewriting the history of the branch. If you have a remote branch:

- Ensure no one else is working on it.
- Delete the remote branch or push your local branch with `-f`.
- Don't pull from your remote branch after rebasing.
