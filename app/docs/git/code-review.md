# Pull requests and Code Review

Due to the size of the codebase, this is probably the most important part of the workflow. Not only is it an opportunity for you to catch errors, it allows you to see code that is moving into master which makes future authoring and debugging easier.

## Creating a good Pull Request

Code review should start when you begin the feature - discuss it with another dev. Reviewing a Pull Request is significantly easier if the other developer already understands the feature and implementation beforehand.

- Avoid long running branches! Long branches are *much* harder to code review.

- Include visual aids (images, animated gifs) in your Pull Requests.


## Reviewing other Pull Requests

Code reviews are an opportunity for both devs to learn, both about the feature and about the language. Be strict in your code review. Don't let laziness slip through as it is so much harder to remove code than it is to add it.

Make comments as helpful as possible. "This could be improved by using this existing module [link]" is better than "This is wrong."

#### Questions to ask

- Is the code as clear as it can be? Will I understand this again in 2 months.
- Is there any unusual code that is not explained in a comment?
- Has a module been authored that already exists?
- Does the code contain logic that should be abstracted so it can be used elsewhere?
- Is the code tested?
- Does the code generally follow our coding style guide?

#### Things to look out for

- Any changes that aren't scoped to a module and could affect all of lonelyplanet.com
- Hardcoded paths
- Code duplication
- General code smells e.g. Overriding properties, too many conditionals etc.
- Inclusion of binary content
- Unprefixed JS hooks. All hooks should have a `js-` prefix.
- Incorrect use of the BEM syntax.
- Using IDs in CSS
- Redundant vendor prefixes
