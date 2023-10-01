# Guten Csek

Lead Developer: [Connor Doman](https://github.com/connordoman)

## Description

A series of Gutenberg blocks for use in the new Csek Creative rebrand. Our hope is to modernize the way we build websites and make it easier for our clients to manage their content and developers to build new features.

## Preface

My hope with this documentation is to make it easier for any future developers to go in, make changes, and add new blocks. I have tried to make the code as readable as possible, but learning new technologies always makes for a bit of a mess. Especially in the earlier code.

To whomever takes over after me: thank you. And, I'm sorry.

## Technology Stack

This is a Wordpress Plugin, so Wordpress + PHP is a given.

Since this was an opportunity to make a Wordpress site for the modern web, I decided to make use of Wordpress' more recently added custom Gutenberg Blocks API. Gutenberg blocks are what the newest WP page editor uses, and using only free libraries provided by Wordpress itself it is possible to create fully customizable blocks. This is effectively a first-party replacement for ACF Pro.

That being said, ACF Pro still earns its premium label by making the process smoother. Personally, the greatest challenge was initial set up. Installation documentation is still strangely sparse and inconsistent. If I'm not mistaken, the technique ultimately used here are "static" blocks, meaning the blocks are compiled to HTML when the page is published and then simply echoed into the document flow.

### React

React is a JavaScript framework for creating front-end interfaces. As of 2023, React is still the most popular among all frameworks and is still widely used all over the web. The appeal of React is its flexibility and modularity. A great oversimplification is that React acts like your browser window and manages elements and their relationships. In dynamic contexts, this allows for behavior and state management at the component level, which is very useful.

Additionally, React lets you combine multiple HTML elements into macro-elements called components. These components can then be added to other components and so on. This makes writing pages with React much cleaner and easier to read and allows the developer to abstract away low-level HTML/DOM behavior.

Here is an example of a component:

```jsx
const MacroElement = () => {
    return (
        <div>
            <h2>Macro Element Title</h2>
            <p>Macro element body</p>
        </div>
    );
};
```

You can see that this component is simply a JavaScript function that returns a `JSX.Element`. `JSX` is a syntax that allows you to mix HTML entities directly into JavaScript code. Essentially, the outermost tags `<...></...>` act like the quotation marks of a `string`, making that code block a unique datatype. This means it's okay to write `const elmt = <div></div>`, where `typeof elmt` returns `JSX.Element`.

Here's how you can reuse your own components:

```jsx
// const MacroElement = () => { ... }

const CompositionOfElements = () => {
    return (
        <ul>
            <li>
                <MacroElement />
            </li>
            <li>
                <MacroElement />
            </li>
            <li>
                <MacroElement />
            </li>
        </ul>
    );
};
```

### TypeScript

`TypeScript` is a superset of JavaScript, meaning all JavaScript is valid TypeScript but not vice-versa. It adds strict typing to JavaScript, which solves problems like accidentally passing the wrong kind of object as a parameter or accessing a method that an object does not have. In recent months/years TypeScript has been criticized for adding bulk to code by forcing developers to declare types. Additionally, some libraries written for JavaScript will not obey TypeScript rules and create errors in compilation.

Speaking of which, TypeScript must be compiled into JavaScript before it can be run in the browser. There are many tools, like `webpack`, that handle this dynamically and also minify and combine all your files into chunks easily digested by the browser. Wordpress' software suite for Gutenberg blocks includes `webpack` and `typescript` out of the box.

#### TypeScript with React

When you use React and TypeScript together (`.jsx` => `.tsx`), there are some other considerations to make.

In React, components can be passed data in the form of "props" (properties). These are just like HTML `attributes` (and in fact all attributes are translated into props by React), except they are managed directly by React and influence component state.

When you want to make a more flexible component like, say, a list item that combines a few other bits of metadata, you need to give it props. When you want to declare props while using TypeScript, you must use an `interface`. This basically gives a type to this components `props`, the first argument of every React component.

Here's an example:

```tsx
interface MacroElementProps {
    title: string;
    message: string;
}

const MacroElement = ({ title, message }: MacroElementProps) => {
    return (
        <div>
            <h2>{title}</h2>
            <p>{message}</p>
        </div>
    );
};
```

Now, we can use `MacroElement` like this:

```tsx
<MacroElement title="Hello World" message="Something to say" />
```

And once the React renders, it will show simply as the HTML:

```html
<div>
    <h2>Hello World</h2>
    <p>Something to say</p>
</div>
```

Small examples like these don't make the benefit clear, but imagine being able to echo an entire sign-up form anywhere you want on the page and bring all of its actions with it, all by writing one HTML element's worth of code.

### Gutenberg Blocks

For static Gutenberg blocks, every block requires you to create 2 components:

1. An `edit` component
2. A `save` component

The `edit` component is what renders when the user is building the page. This is their opportunity to customize the contents and layout as they wish. This is also where all of Reacts functionality is present, since editing the page/post is a "live" experience.

The `save` component is what renders once the user clicks "Publish" or "Save Draft". This is finalized exactly in that moment and saved to the database as-is. This means that behaviors must be defined more traditionally using JavaScript, but more on that later.

Gutenberg blocks also receive special props. Every block has `attributes`, a Wordpress construct that represents the kinds of values a block can accept/access. These work kind of like props and kind of like another React principle, state variables.

In a minute, state variables are how React components can change their appearance over time. If a user types into an `<input>`, the input's value is stored in some state variable. Then, when React rerenders the page to reflect the changes, it knows about that state variable and so the `<input>` component doesn't just get reset.

For Gutenberg blocks, every `edit` component needs to accept `attributes` and `setAttributes` as its props. For `save`, only `attributes` is necessary.
