# :large_blue_diamond: Personal Portfolio

This is my new personal portfolio, based on webGL! :)

I worked on a first test-release with pure javascript and by-hand
minification... it was a huge mess! Whatever I had to edit something,
thinking about a 1200+ lines code was a nightmare for me :(

So... without much experience with Javascript modules and Typescript I
started a new adventure and now you can see the result!

You can see the webGL in action on my
[website](https://www.lightdestory.com) !

### :large_blue_diamond: TO-DO:

- [X] Get it working...:)
- [X] Modules architecture!
- [X] Sort of responsive :O
- [X] Integration with GitHub
- [X] Continuous Delivery with GitHub Actions
- [ ] Blog section
- [ ] CSS improvement
- [ ] Codebase improvement

### :large_blue_diamond: Short explanation

The website is composed by various views, one module for each. The
modules define the views putting inside the data.

The views are tagged as "**section**" for the main view and "**page**"
for the secondary view. **Example**: "*Projects*" is a **section**,
"*Project-Detail of 'CCleanerUpdater*' is a **page**.

Currently, the only section having pages is "Projects", so there isn't
much abstraction regarding the page handling. When I will implement the
blog I will improve it.

The data of the website is placed inside the module 'dataset'. Before
the to-Typescript migrations it was possible to easily add new 'already
known' type of data without any HTML editing or repacking. After the
migration, to add new data a 'build' is required.

A build? Yes, you are reading correctly. I am using 'ParcelJS' to bundle
my website.

### :large_blue_diamond: Build

I am using ParcelJS to bundle my website. With a simple command you can
get a production ready site to put on your servers!

#### Prerequisites

- NodeJS

The following instruction will help you getting your own copy working:

1. Download/Clone this repository
2. Install the dependencies using the following command inside the
   repository folder: `npm install`
3. Make your chances
4. Use the following command to run a testing web-server: `npx parcel
   index.html`
5. Get your production-ready, inside the *dist* folder, using the
   following command: `npx parcel build index.html`


### :large_blue_diamond: License :copyright:
[This Project is under MIT](LICENSE.md)