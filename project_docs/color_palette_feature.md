New Feature: Color Pallete Selection

Context: I want to set up a color pallete selection tool for this project. Because this project is intended to be a general-use template for any business to use, I want users to be able to select different color palletes to better visualize what the site could look like with their company's color pallete.

References: I want to set up a similar color pallete system to this website: `https://www.happyhues.co/`. where the color pallete selection affects the page background, element backgrounds, text colors, accent colors, etc. NOTE: this website has it's color pallete system based on URLs. I don't want that - I want our color pallete system to switch the pallete without changing the URL, similar to how a standard light/dark mode selection works. 

Request:
1) analyze the project's components and the Tailwind configuration to understand how we handle colors.
2) use Tailwind's color varaiables to set up a dual-layered theme system: the first layer should be a generic `theme-page-bg`, `theme-headline`, `theme-button`, etc. These are the Tailwind classes that should be applied to the proejct's components. The second layer of the theme system should be the different sets of color palletes and their variables, which are them applied to the generic layer. This way, we can use one set of Tailwind classes throughout the project's components, and swap out the colors palletes in a single place.
3) Build a set of color palletes for us to use. Start by pulling the first 6 color palletes from the sidebar on the `https://www.happyhues.co/` website we're using as inspitaration for this.
4) Go through the projects components and pages, and update the color classes to use our new system. Set up a planning doc specifically for this step, as you'll be covering a large amount of files.
5) Set up a color selection menu component that displays our color pallete options and let's us quickly toggle between them. Try to replicate the design of the sidebar element on `https://www.happyhues.co/`.
6) set up a simple LocalStorage function for keeping the user's color pallete selection persistent across pages.