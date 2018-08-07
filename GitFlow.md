# GitFlow for the project

## Branch Policy

A branch per feature, each user is assigned a feature, a user may be working on more than one feature at a given time.

Two branches for aggregate all the features:

- Master: Main branch for developing
- Production: Main branch for production

## Pull-Merge Policy

Once the feature was finished, a pull from master has to be done and then resolves conflics if any and then merge to master and push.

Once a set of features is completed a merge from master to production is done and then a tag is created and send to revision.