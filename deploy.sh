#!/bin/bash

echo -e "\033[0;32mFetching todays quote...\033[0m"

Rscript fetch_quote.R

echo -e "\033[0;32mDeploying updates to Github...\033[0m"


# Add changes to git.
git add .

# Commit changes.
msg="rebuilding site `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

# Push source and build repos.
git push origin master
git subtree push --prefix=public https://github.com/apoorv74/apoorv74.github.io.git master
