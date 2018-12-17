# UTBiden: The Video Game

Have you ever wondered what it's like to be the 47th Vice President of the United States and Presidential Professor of Practice, Joseph Robinette Biden Jr? Now's your chance! Hop on your scooter and navigate Locust as you travel from Perry World House to your meeting with Amy Gutmann.

## Local Development

UTBiden is written entirely in vanilla JavaScript. To work on the game, simply edit the relevant files and open `index.html` in your browser to test it. Alternatively, you can spin up a python server with `python -m http.server` for Python 3 or `python -m SimpleHTTPServer` for Python 2.7.

## Deployment

This game [lives](https://projects.underthebutton.com/utbiden/) on Under the Button's projects site. In order to do this, UTBiden is included as a submodule of the [projects.underthebutton.com](https://github.com/dailypenn/projects.underthebutton.com) repo.

When you're done making and testing your changes in this repo, simply push to `master`. The projects page will not update automatically, so you'll need to update the submodule manually from that repo.

To do so, `cd` into the `projects.underthebutton.com` repo in your terminal. Then `cd` into the `utbiden` folder within that repo. Run `git pull` to get the changes that you just pushed to the `utbiden` repo. Then run `cd ../` (which will take you back to the root of the repo), and run `git status`. You'll notice that it will indicate that there are new changes to `utbiden`. Just add, commit, and push as usual, and the page will be updated!

## Credits

UTBiden was built by Jessica Peng. The art was directed and created by Julia Schorr. The sounds were recorded and edited by Alessandro Consuelos.
